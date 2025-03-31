"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { NeoCard } from "@/components/ui/neo-card";
import { NeoButton } from "@/components/ui/neo-button";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface EsimInstallationDetailsProps {
  activationCode: string; // The full LPA string from Maya
  manualCode: string;
  smdpAddress: string;
}

export function EsimInstallationDetails({
  activationCode,
  manualCode,
  smdpAddress,
}: EsimInstallationDetailsProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // Generate the QR code string in the LPA format: LPA:1$<smdpAddress>$<activationCode>
    // Note: Maya's activation_code might already be the full LPA string.
    // Double-check Maya's response format. Assuming activationCode IS the full string for now.
    // If activationCode is just the part after the second '$', construct it like:
    // const lpaString = `LPA:1$${smdpAddress}$${activationCode}`;
    const lpaString = activationCode; // Assuming activationCode is the full LPA string

    QRCode.toDataURL(lpaString, { errorCorrectionLevel: "M" }) // Medium error correction
      .then((url) => {
        setQrCodeDataUrl(url);
      })
      .catch((err) => {
        console.error("Failed to generate QR code:", err);
        toast({
          title: "Error",
          description: "Could not generate QR code.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [activationCode, smdpAddress]); // Rerun if props change

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied!",
          description: `${label} copied to clipboard.`,
        });
      },
      (err) => {
        console.error(`Could not copy ${label}:`, err);
        toast({
          title: "Copy Failed",
          description: `Could not copy ${label}. Please copy manually.`,
          variant: "destructive",
        });
      }
    );
  };

  return (
    <NeoCard className="p-6">
      <h3 className="text-2xl font-bold mb-4 text-center">Install Your eSIM</h3>
      
      {isLoading ? (
        <div className="flex flex-col items-center">
          <Skeleton className="h-48 w-48 mb-4" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ) : qrCodeDataUrl ? (
        <div className="text-center mb-6">
          <p className="mb-2 text-muted-foreground">Scan the QR code with your phone's camera:</p>
          <img
            src={qrCodeDataUrl}
            alt="eSIM QR Code"
            className="mx-auto border border-black p-2"
            width={192} // 48 * 4
            height={192}
          />
        </div>
      ) : (
        <p className="text-center text-red-600 mb-4">Could not display QR code.</p>
      )}

      <div className="text-center mb-6">
        <NeoButton 
          variant="outline" 
          size="sm" 
          onClick={() => setShowManual(!showManual)}
        >
          {showManual ? "Hide" : "Show"} Manual Installation Details
        </NeoButton>
      </div>

      {showManual && (
        <div className="space-y-4 border-t border-dashed border-gray-400 pt-6">
          <h4 className="text-lg font-semibold text-center">Manual Setup</h4>
          <p className="text-sm text-muted-foreground text-center">If you cannot scan the QR code, enter these details manually in your phone's settings:</p>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm">SM-DP+ Address:</span>
              <NeoButton variant="ghost" size="sm" onClick={() => copyToClipboard(smdpAddress, "SM-DP+ Address")}>Copy</NeoButton>
            </div>
            <p className="text-sm bg-gray-100 p-2 rounded border border-gray-300 break-all">{smdpAddress}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm">Activation Code:</span>
               <NeoButton variant="ghost" size="sm" onClick={() => copyToClipboard(manualCode, "Activation Code")}>Copy</NeoButton>
            </div>
             <p className="text-sm bg-gray-100 p-2 rounded border border-gray-300 break-all">{manualCode}</p>
          </div>
          
          <p className="text-xs text-muted-foreground text-center pt-2">Refer to your device manufacturer's instructions for adding an eSIM manually.</p>
        </div>
      )}
    </NeoCard>
  );
}
