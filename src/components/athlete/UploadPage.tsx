
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { SidebarProvider } from '../ui/sidebar';
import { AthleteSidebar } from './AthleteSidebar';
import { ThemeToggle } from '../theme/ThemeToggle';
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react';

export function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [sessionName, setSessionName] = useState('');
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    setUploading(false);
    
    // Reset form
    setFile(null);
    setSessionName('');
    setNotes('');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AthleteSidebar />
        <main className="flex-1 overflow-auto">
          {/* Top Bar with Theme Toggle */}
          <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-end">
                <ThemeToggle />
              </div>
            </div>
          </div>
          
          <div className="container mx-auto px-6 py-8">
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-ayger-navy mb-2">Upload Training Session</h1>
                <p className="text-muted-foreground">
                  Upload your training data files (GPX, TCX, FIT) to analyze performance
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Upload Session Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Session Name</label>
                      <Input
                        value={sessionName}
                        onChange={(e) => setSessionName(e.target.value)}
                        placeholder="e.g., Morning 10K Run"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Training File</label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept=".gpx,.tcx,.fit"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          {file ? (
                            <div className="flex items-center justify-center gap-2">
                              <File className="h-8 w-8 text-primary" />
                              <span className="text-sm font-medium">{file.name}</span>
                            </div>
                          ) : (
                            <div>
                              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                              <p className="text-sm text-muted-foreground">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                GPX, TCX, FIT files supported
                              </p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add any notes about this session..."
                        rows={3}
                      />
                    </div>

                    <Button
                      onClick={handleUpload}
                      disabled={!file || uploading}
                      className="w-full"
                    >
                      {uploading ? 'Uploading...' : 'Upload Session'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Upload Status & Tips */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Supported File Types
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">GPX Files</span>
                        <Badge variant="secondary">GPS Data</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">TCX Files</span>
                        <Badge variant="secondary">Training Data</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">FIT Files</span>
                        <Badge variant="secondary">Garmin/Polar</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-blue-500" />
                        Upload Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                      <p>• Export files directly from your GPS watch or training app</p>
                      <p>• Ensure GPS data is included for accurate analysis</p>
                      <p>• Files are processed automatically after upload</p>
                      <p>• Large files may take a few minutes to process</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
