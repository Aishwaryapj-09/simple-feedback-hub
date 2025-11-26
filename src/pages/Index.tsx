import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/StarRating";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, CheckCircle2 } from "lucide-react";
import { z } from "zod";

const feedbackSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255).optional().or(z.literal("")),
  rating: z.number().min(1, "Please select a rating").max(5),
  comments: z.string().trim().min(1, "Comments are required").max(1000),
});

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 0,
    comments: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      const validatedData = feedbackSchema.parse(formData);
      setIsLoading(true);

      const { error } = await supabase.from("feedback").insert({
        name: validatedData.name,
        email: validatedData.email || null,
        rating: validatedData.rating,
        comments: validatedData.comments,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Thank you for your feedback!",
        description: "Your response has been recorded successfully.",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: "Error",
          description: "Failed to submit feedback. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center shadow-[var(--shadow-card)] animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Thank You!</h2>
          <p className="text-muted-foreground mb-6">
            Your feedback has been successfully submitted. We appreciate you taking the time to share your thoughts.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({ name: "", email: "", rating: 0, comments: "" });
              }}
              className="w-full"
            >
              Submit Another Response
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/reviews")}
              className="w-full"
            >
              View All Feedback
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <header className="text-center mb-12 animate-in fade-in slide-in-from-top duration-500">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Share Your Feedback
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We value your opinion! Please take a moment to tell us about your experience.
          </p>
        </header>

        <Card className="p-6 md:p-8 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                className={errors.name ? "border-destructive" : ""}
                maxLength={100}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email <span className="text-muted-foreground text-xs">(Optional)</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                className={errors.email ? "border-destructive" : ""}
                maxLength={255}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Rating <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <StarRating
                  rating={formData.rating}
                  onRatingChange={(rating) => setFormData({ ...formData, rating })}
                />
                {formData.rating > 0 && (
                  <span className="text-sm text-muted-foreground ml-2">
                    {formData.rating} / 5
                  </span>
                )}
              </div>
              {errors.rating && (
                <p className="text-sm text-destructive">{errors.rating}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments" className="text-sm font-medium">
                Comments <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="comments"
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                placeholder="Share your thoughts and feedback..."
                className={`min-h-[120px] resize-none ${errors.comments ? "border-destructive" : ""}`}
                maxLength={1000}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                {errors.comments && (
                  <p className="text-destructive">{errors.comments}</p>
                )}
                <span className="ml-auto">{formData.comments.length} / 1000</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Submitting..." : "Submit Feedback"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/reviews")}
              >
                View Feedback
              </Button>
            </div>
          </form>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Your feedback helps us improve. Thank you for your time!
        </p>
      </div>
    </div>
  );
};

export default Index;
