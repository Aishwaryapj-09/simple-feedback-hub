import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/StarRating";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Mail, MessageSquare } from "lucide-react";
import { format } from "date-fns";

interface Feedback {
  id: string;
  name: string;
  email: string | null;
  rating: number;
  comments: string;
  created_at: string;
}

const Reviews = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFeedback(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <header className="mb-12 animate-in fade-in slide-in-from-top duration-500">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Form
          </Button>
          
          <div className="flex items-center gap-3 mb-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              All Feedback
            </h1>
          </div>
          <p className="text-muted-foreground">
            {feedback.length} {feedback.length === 1 ? "response" : "responses"} collected
          </p>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : feedback.length === 0 ? (
          <Card className="p-12 text-center shadow-[var(--shadow-card)]">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No feedback yet</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to share your thoughts!
            </p>
            <Button onClick={() => navigate("/")}>
              Submit Feedback
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6">
            {feedback.map((item, index) => (
              <Card
                key={item.id}
                className="p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {item.name}
                      </h3>
                      {item.email && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span>{item.email}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(item.created_at), "PPP 'at' p")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating rating={item.rating} readonly size="sm" />
                    <span className="text-sm font-medium text-foreground">
                      {item.rating}/5
                    </span>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {item.comments}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
