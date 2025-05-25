
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, CheckCircle } from 'lucide-react';

const YocoKeySetup: React.FC = () => {
  const [publicKey, setPublicKey] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (publicKey && publicKey.startsWith('pk_live_')) {
      navigator.clipboard.writeText(`export const YOCO_PUBLIC_KEY = '${publicKey}';`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isValidKey = publicKey.startsWith('pk_live_') && publicKey.length > 20;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Yoco API Key Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="publicKey">Yoco Live Public Key</Label>
          <Input
            id="publicKey"
            type="text"
            placeholder="pk_live_..."
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            className="mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">
            Enter your live public key from your Yoco Dashboard
          </p>
        </div>

        {publicKey && !isValidKey && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertDescription className="text-yellow-800">
              Live public keys should start with "pk_live_"
            </AlertDescription>
          </Alert>
        )}

        {isValidKey && (
          <div className="space-y-3">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Valid public key format detected!
              </AlertDescription>
            </Alert>

            <div className="bg-gray-100 p-3 rounded-lg">
              <Label className="text-sm font-medium">Code to replace in src/utils/yoco.ts:</Label>
              <div className="bg-white p-2 mt-1 rounded border font-mono text-sm">
                export const YOCO_PUBLIC_KEY = '{publicKey}';
              </div>
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className="mt-2"
                disabled={copied}
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>

            <Alert>
              <AlertDescription>
                <strong>Next steps:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                  <li>Copy the code above</li>
                  <li>Replace the YOCO_PUBLIC_KEY line in src/utils/yoco.ts</li>
                  <li>Test your payment integration</li>
                </ol>
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p><strong>Find your keys at:</strong></p>
          <a 
            href="https://portal.yoco.com/online/settings/api-keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Yoco Portal → Settings → API Keys
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default YocoKeySetup;
