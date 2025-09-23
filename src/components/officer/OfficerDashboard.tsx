import { useState } from 'react';
import { Search, FileText, Download, Eye, Calendar, User, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
  description?: string;
  relevanceScore?: number;
}

export const OfficerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Document[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  // Mock documents for demonstration
  const mockDocuments: Document[] = [
    {
      id: '1',
      name: 'Operation_Alpha_Brief.pdf',
      type: 'application/pdf',
      size: 2456789,
      uploadedBy: 'Clerk Sharma',
      uploadedAt: '2024-01-15T10:30:00Z',
      tags: ['operation', 'briefing', 'classified'],
      description: 'Operational briefing for Mission Alpha',
      relevanceScore: 95
    },
    {
      id: '2',
      name: 'Personnel_Records_Q1.xlsx',
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: 1234567,
      uploadedBy: 'Clerk Kumar',
      uploadedAt: '2024-01-14T14:20:00Z',
      tags: ['personnel', 'records', 'quarterly'],
      description: 'Q1 personnel records and statistics',
      relevanceScore: 87
    },
    {
      id: '3',
      name: 'Training_Schedule_2024.docx',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      size: 987654,
      uploadedBy: 'Clerk Singh',
      uploadedAt: '2024-01-13T09:15:00Z',
      tags: ['training', 'schedule', '2024'],
      description: 'Annual training schedule and requirements',
      relevanceScore: 78
    }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Query Required",
        description: "Please enter a search term or keywords",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      // TODO: Integrate with Grok AI API for semantic search
      // This is a mock implementation
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Filter mock documents based on search query
      const filtered = mockDocuments.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      // Sort by relevance score
      const sorted = filtered.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

      setSearchResults(sorted);

      toast({
        title: "Search Completed",
        description: `Found ${sorted.length} relevant documents`,
      });
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Unable to complete search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeLabel = (type: string) => {
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('word')) return 'Word';
    if (type.includes('sheet')) return 'Excel';
    if (type.includes('image')) return 'Image';
    return 'Document';
  };

  const handleDownload = (doc: Document) => {
    // TODO: Implement actual download from Supabase storage
    toast({
      title: "Download Started",
      description: `Downloading ${doc.name}`,
    });
  };

  const handlePreview = (doc: Document) => {
    // TODO: Implement document preview
    toast({
      title: "Preview",
      description: `Opening preview for ${doc.name}`,
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold command-text text-foreground">
          Document Search Center
        </h2>
        <p className="text-muted-foreground">
          AI-powered document search and retrieval system
        </p>
      </div>

      {/* Search Interface */}
      <Card className="document-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Intelligent Document Search</span>
          </CardTitle>
          <CardDescription>
            Search documents by name, content, or keywords using AI-powered semantic search
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Query</Label>
              <div className="flex space-x-2">
                <Input
                  id="search"
                  placeholder="Enter document name, keywords, or content to search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="bg-input flex-1"
                />
                <Button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="military-badge"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p><strong>Search Tips:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Use specific keywords for better results</li>
                <li>Search by document type (e.g., "briefing", "report", "schedule")</li>
                <li>Include date or time periods for targeted results</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {hasSearched && (
        <Card className="document-card">
          <CardHeader>
            <CardTitle>
              Search Results {searchResults.length > 0 && `(${searchResults.length})`}
            </CardTitle>
            <CardDescription>
              {searchResults.length > 0 
                ? `Documents matching "${searchQuery}" sorted by relevance`
                : `No documents found for "${searchQuery}"`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start space-x-3">
                        <FileText className="h-6 w-6 text-primary mt-1" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {doc.name}
                          </h3>
                          {doc.description && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {doc.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2 mb-2">
                            {doc.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {doc.relevanceScore && (
                        <Badge variant="default" className="ml-2">
                          {doc.relevanceScore}% match
                        </Badge>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{doc.uploadedBy}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                        </span>
                        <Badge variant="outline">
                          {getFileTypeLabel(doc.type)}
                        </Badge>
                        <span>{formatFileSize(doc.size)}</span>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePreview(doc)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDownload(doc)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No documents found matching your search criteria.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try different keywords or check the search tips above.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};