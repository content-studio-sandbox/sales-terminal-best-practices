import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Grid, 
  Column, 
  Tile, 
  Button, 
  TextInput, 
  Form,
  FormGroup,
  InlineNotification
} from "@carbon/react";
import { View, ViewOff } from "@carbon/icons-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Successfully logged in!",
        });
        
        navigate("/");
      } else {
        // Sign up
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
            },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Account created successfully! Please check your email for verification.",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred during authentication";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, var(--cds-layer-01), var(--cds-layer-02))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <Tile style={{ padding: '32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '24px',
              fontWeight: '600',
              color: 'var(--cds-interactive)',
              marginBottom: '8px'
            }}>
              {isLogin ? "Login" : "Sign Up"}
            </h2>
            <p style={{ 
              color: 'var(--cds-text-secondary)',
              fontSize: '14px'
            }}>
              Welcome to Your Projects at IBM
            </p>
          </div>

          {error && (
            <InlineNotification
              kind="error"
              title="Error"
              subtitle={error}
              style={{ marginBottom: '16px' }}
              onClose={() => setError("")}
            />
          )}

          <Form onSubmit={handleSubmit}>
            <FormGroup legendText="">
              <TextInput
                id="email"
                labelText="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </FormGroup>

            {!isLogin && (
              <FormGroup legendText="">
                <TextInput
                  id="displayName"
                  labelText="Display Name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  placeholder="Enter your display name"
                />
              </FormGroup>
            )}

            <FormGroup legendText="">
              <div style={{ position: 'relative' }}>
                <TextInput
                  id="password"
                  labelText="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
                <Button
                  kind="ghost"
                  size="sm"
                  renderIcon={showPassword ? ViewOff : View}
                  iconDescription={showPassword ? "Hide password" : "Show password"}
                  hasIconOnly
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '32px',
                    zIndex: 1
                  }}
                />
              </div>
            </FormGroup>

            <Button
              type="submit"
              kind="primary"
              size="lg"
              disabled={loading}
              style={{ 
                width: '100%',
                marginTop: '24px'
              }}
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
            </Button>
          </Form>

          <div style={{ 
            textAlign: 'center',
            marginTop: '24px'
          }}>
            <Button
              kind="ghost"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </Button>
          </div>
        </Tile>
      </div>
    </div>
  );
};

export default Auth;