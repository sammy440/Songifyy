"use client";

import { AlertCircle, ExternalLink, Key } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApiSetupBannerProps {
  show: boolean;
}

export function ApiSetupBanner({ show }: ApiSetupBannerProps) {
  if (!show) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50",
        "animate-slide-up"
      )}
    >
      <div
        className={cn(
          "p-4 rounded-2xl",
          "bg-card/95 backdrop-blur-xl border border-amber-500/30",
          "shadow-lg shadow-amber-500/10"
        )}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 shrink-0">
            <Key className="h-5 w-5 text-amber-500" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Spotify API Setup Required
            </h3>

            <p className="text-sm text-muted-foreground mt-1 mb-3">
              To enable music search, add your Spotify API credentials to the
              environment variables.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2 rounded bg-muted/50 font-mono">
                <span className="text-amber-500">SPOTIFY_CLIENT_ID</span>=your_client_id
              </div>
              <div className="p-2 rounded bg-muted/50 font-mono">
                <span className="text-amber-500">SPOTIFY_CLIENT_SECRET</span>=your_secret
              </div>
            </div>

            <a
              href="https://developer.spotify.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 mt-3 text-sm",
                "text-primary hover:text-primary/80 transition-colors"
              )}
            >
              Get your API keys
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
