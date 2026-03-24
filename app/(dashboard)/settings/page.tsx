"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Eye, EyeOff, Key } from "lucide-react";

type AIProvider = "openai" | "claude" | "gemini";

export default function SettingsPage() {
  const [provider, setProvider] = useState<AIProvider>("openai");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load saved settings
    const savedProvider = localStorage.getItem("ai_provider") as AIProvider;
    const savedKey = localStorage.getItem("ai_api_key");

    if (savedProvider) setProvider(savedProvider);
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleSave = () => {
    localStorage.setItem("ai_provider", provider);
    localStorage.setItem("ai_api_key", apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Settings</h2>
        <p className="text-muted-foreground">
          Configure your AI provider and API keys for design analysis
        </p>
      </div>

      <div className="space-y-8">
        {/* AI Provider Selection */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Key className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">AI Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Choose your AI provider and enter API key
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Provider Selection */}
            <div className="space-y-2">
              <Label htmlFor="provider">AI Provider</Label>
              <Select
                value={provider}
                onValueChange={(value: AIProvider) => setProvider(value)}
              >
                <SelectTrigger id="provider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">
                    OpenAI (GPT-4 Vision)
                  </SelectItem>
                  <SelectItem value="claude">
                    Anthropic (Claude 3.5 Sonnet)
                  </SelectItem>
                  <SelectItem value="gemini">
                    Google (Gemini 1.5 Pro)
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Select the AI model to use for design analysis
              </p>
            </div>

            {/* API Key Input */}
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <div className="relative">
                <Input
                  id="api-key"
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showKey ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally and never sent to our servers
              </p>
            </div>

            {/* Save Button */}
            <Button onClick={handleSave} disabled={!apiKey} className="w-full">
              {saved ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Provider Information */}
        <div className="bg-muted/50 border border-border rounded-lg p-6 space-y-4">
          <h4 className="font-semibold">How to get API keys:</h4>

          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium text-foreground">OpenAI (GPT-4 Vision)</p>
              <p className="text-muted-foreground">
                1. Go to{" "}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  platform.openai.com/api-keys
                </a>
              </p>
              <p className="text-muted-foreground">
                2. Create a new API key
              </p>
              <p className="text-muted-foreground">
                3. Copy and paste it above
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Cost: ~$0.01-0.03 per image analysis
              </p>
            </div>

            <div>
              <p className="font-medium text-foreground">
                Anthropic (Claude 3.5 Sonnet)
              </p>
              <p className="text-muted-foreground">
                1. Go to{" "}
                <a
                  href="https://console.anthropic.com/settings/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  console.anthropic.com/settings/keys
                </a>
              </p>
              <p className="text-muted-foreground">
                2. Create a new API key
              </p>
              <p className="text-muted-foreground">
                3. Copy and paste it above
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Cost: ~$0.015-0.025 per image analysis
              </p>
            </div>

            <div>
              <p className="font-medium text-foreground">
                Google (Gemini 1.5 Pro)
              </p>
              <p className="text-muted-foreground">
                1. Go to{" "}
                <a
                  href="https://makersuite.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  makersuite.google.com/app/apikey
                </a>
              </p>
              <p className="text-muted-foreground">
                2. Create a new API key
              </p>
              <p className="text-muted-foreground">
                3. Copy and paste it above
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Cost: Free tier available, then ~$0.01 per image
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4">
          <p className="text-sm text-foreground">
            <strong>Privacy:</strong> Your API key is stored only in your
            browser's localStorage and is never sent to our servers. All AI
            analysis happens directly between your browser and the AI provider.
          </p>
        </div>
      </div>
    </div>
  );
}
