'use client'

import QRCode from 'react-qr-code'
import { Button } from './ui/button'
import { Download } from 'lucide-react'

interface MayaQRCodeProps {
  activationCode: string
  className?: string
}

export function MayaQRCode({ activationCode, className }: MayaQRCodeProps) {
  const downloadQR = () => {
    const svg = document.getElementById('maya-qr-code') as SVGSVGElement
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = 'maya-esim-qr.png'
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
  }

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <QRCode
        id="maya-qr-code"
        value={activationCode}
        size={256}
        level="H"
        className="p-4 bg-white rounded-lg"
      />
      <Button variant="outline" onClick={downloadQR}>
        <Download className="w-4 h-4 mr-2" />
        Download QR Code
      </Button>
    </div>
  )
}
