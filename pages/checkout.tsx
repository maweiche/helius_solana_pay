import Link from "next/link";
import { createQR, encodeURL, TransferRequestURLFields, findReference, validateTransfer, FindReferenceError, ValidateTransferError } from "@solana/pay";
import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef } from "react";
import calculatePrice from "../lib/calculatePrice";

export default function Checkout() {
  const router = useRouter()
  const shopAddress = new PublicKey('7wK3jPMYjpZHZAghjersW6hBNMgi9VAGr75AhYRqR2n')

  // ref to a div where we'll show the QR code
  const qrRef = useRef<HTMLDivElement>(null)

  const amount = useMemo(() => calculatePrice(router.query), [router.query])

  // Read the URL query (which includes our chosen products)
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(router.query)) {
    if (value) {
      if (Array.isArray(value)) {
        for (const v of value) {
          searchParams.append(key, v);
        }
      } else {
        searchParams.append(key, value);
      }
    }
  }

  // Generate the unique reference which will be used for this transaction
  const reference = useMemo(() => Keypair.generate().publicKey, []);

  // Add it to the params we'll pass to the API
  searchParams.append('reference', reference.toString());

  // Get a connection to Solana devnet
  const endpoint = clusterApiUrl('devnet')
  const connection = new Connection(endpoint, 'confirmed')

  // Solana Pay transfer params
  const urlParams: TransferRequestURLFields = {
    recipient: shopAddress,
    amount,
    reference,
    label: "Helius Toys R Us",
    message: "🦀 Thanks for your order! 🧸",
  }

  // Show the QR code
  useEffect(() => {
    const solanaUrl = encodeURL(urlParams)
    const qr = createQR(solanaUrl, 512, 'transparent')
    if (qrRef.current && amount.isGreaterThan(0)) {
      qrRef.current.innerHTML = ''
      qr.append(qrRef.current)
    }
  })

  // Check every 0.5s if the transaction is completed
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Check if there is any transaction for the reference
        const signatureInfo = await findReference(connection, reference, { finality: 'confirmed' })
        // Validate that the transaction has the expected recipient, amount and SPL token
        await validateTransfer(
          connection,
          signatureInfo.signature,
          {
            recipient: shopAddress,
            amount,
            reference,
          },
          { commitment: 'confirmed' }
        )
        alert(`Transaction confirmed! Link: https://solscan.io/tx/${signatureInfo.signature}?cluster=devnet`)
        router.push('/')
      } catch (e) {
        if (e instanceof FindReferenceError) {
          // No transaction found yet, ignore this error
          return;
        }
        if (e instanceof ValidateTransferError) {
          // Transaction is invalid
          console.error('Transaction is invalid', e)
          return;
        }
        console.error('Unknown error', e)
      }
    }, 500)
    return () => {
      clearInterval(interval)
    }
  }, [amount])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100vh', justifyContent: 'center', background: 'linear-gradient(180deg, #FFFFFF 0%, #E5E5E5 100%)'}}>
      <Link href='/'style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer', fontSize: '24px'  }}>
        Cancel
      </Link>

      <h1 className="text-2xl font-bold">Checkout {amount.toString()} SOL</h1>

      {/* div added to display the QR code */}
      <div ref={qrRef} />
    </div>
  )
}