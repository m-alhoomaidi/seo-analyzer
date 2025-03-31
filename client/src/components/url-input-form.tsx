import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface UrlInputFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export function UrlInputForm({ onSubmit, isLoading }: UrlInputFormProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const validateUrl = (input: string): boolean => {
    if (!input.trim()) {
      setError("Please enter a URL");
      return false;
    }

    // Simple validation for URL format
    const urlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](\.[a-zA-Z]{2,})+/;
    if (!urlPattern.test(input)) {
      setError("Please enter a valid URL");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateUrl(url)) {
      // Auto-prefix URL if needed
      let processedUrl = url.trim();
      if (!processedUrl.startsWith("http://") && !processedUrl.startsWith("https://")) {
        processedUrl = "https://" + processedUrl;
      }
      
      onSubmit(processedUrl);
    }
  };

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <Label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-1">
              Enter Website URL
            </Label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                https://
              </span>
              <Input
                id="url-input"
                name="url"
                className="flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                placeholder="example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            <p className="mt-1 text-xs text-gray-500">No need to add http:// or https://</p>
          </div>
          <div className="flex items-end">
            <Button 
              type="submit" 
              className="bg-primary hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-150 ease-in-out flex items-center"
              disabled={isLoading}
            >
              <span>Analyze</span>
              {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
