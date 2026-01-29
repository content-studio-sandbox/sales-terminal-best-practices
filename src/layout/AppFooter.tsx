import { Grid, Column, Link } from "@carbon/react";
import { LogoGithub, LogoLinkedin, Email, Chat } from "@carbon/icons-react";

interface AppFooterProps {
    onFeedbackClick?: () => void;
}

export default function AppFooter({ onFeedbackClick }: AppFooterProps) {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { label: "Terminal Basics", href: "/terminal-basics" },
            { label: "Git Workflows", href: "/git-workflows" },
            { label: "SSH Best Practices", href: "/ssh-best-practices" },
            { label: "Interactive Terminal", href: "/interactive-terminal" },
        ],
        resources: [
            { label: "Documentation", href: "#" },
            { label: "API Reference", href: "#" },
            { label: "Release Notes", href: "#" },
            { label: "Support", href: "#" },
        ],
        company: [
            { label: "About IBM", href: "https://www.ibm.com/about" },
            { label: "Careers", href: "https://www.ibm.com/careers" },
            { label: "Privacy", href: "https://www.ibm.com/privacy" },
            { label: "Terms of Use", href: "https://www.ibm.com/legal" },
        ],
    };

    return (
        <footer
            style={{
                backgroundColor: "#161616",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                marginTop: "auto",
                padding: "3rem 0 2rem"
            }}
        >
            <Grid fullWidth>
                <Column lg={16} md={8} sm={4}>
                    {/* Main Footer Content */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "2rem",
                        marginBottom: "3rem"
                    }}>
                        {/* Brand Section */}
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                                <h3 style={{
                                    fontSize: "1.125rem",
                                    fontWeight: 600,
                                    color: "#f4f4f4",
                                    margin: 0
                                }}>
                                    FSM Technical Best Practices
                                </h3>
                            </div>
                            <p style={{
                                fontSize: "0.875rem",
                                color: "#c6c6c6",
                                lineHeight: 1.6,
                                marginBottom: "1.5rem"
                            }}>
                                Empowering IBM FSM teams with essential terminal, Git, and SSH skills for modern development workflows.
                            </p>
                            {/* Social Links */}
                            <div style={{ display: "flex", gap: "1rem" }}>
                                <Link
                                    href="https://github.com/ibm"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        color: "#c6c6c6",
                                        transition: "color 0.2s"
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = "#0f62fe"}
                                    onMouseLeave={(e) => e.currentTarget.style.color = "#c6c6c6"}
                                >
                                    <LogoGithub size={20} />
                                </Link>
                                <Link
                                    href="https://www.linkedin.com/company/ibm"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        color: "#c6c6c6",
                                        transition: "color 0.2s"
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = "#0f62fe"}
                                    onMouseLeave={(e) => e.currentTarget.style.color = "#c6c6c6"}
                                >
                                    <LogoLinkedin size={20} />
                                </Link>
                                <Link
                                    href="mailto:support@yourprojects.ibm.com"
                                    style={{
                                        color: "#c6c6c6",
                                        transition: "color 0.2s"
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = "#0f62fe"}
                                    onMouseLeave={(e) => e.currentTarget.style.color = "#c6c6c6"}
                                >
                                    <Email size={20} />
                                </Link>
                                {onFeedbackClick && (
                                    <button
                                        onClick={onFeedbackClick}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            padding: 0,
                                            cursor: "pointer",
                                            color: "#c6c6c6",
                                            transition: "color 0.2s"
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = "#0f62fe"}
                                        onMouseLeave={(e) => e.currentTarget.style.color = "#c6c6c6"}
                                        aria-label="Submit Feedback"
                                    >
                                        <Chat size={20} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Product Links */}
                        <div>
                            <h4 style={{
                                fontSize: "0.875rem",
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                color: "#8d8d8d",
                                marginBottom: "1rem"
                            }}>
                                Product
                            </h4>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {footerLinks.product.map((link) => (
                                    <li key={link.label} style={{ marginBottom: "0.75rem" }}>
                                        <Link
                                            href={link.href}
                                            style={{
                                                fontSize: "0.875rem",
                                                color: "#c6c6c6",
                                                textDecoration: "none",
                                                transition: "color 0.2s"
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = "#0f62fe"}
                                            onMouseLeave={(e) => e.currentTarget.style.color = "#c6c6c6"}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resources Links */}
                        <div>
                            <h4 style={{
                                fontSize: "0.875rem",
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                color: "#8d8d8d",
                                marginBottom: "1rem"
                            }}>
                                Resources
                            </h4>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {footerLinks.resources.map((link) => (
                                    <li key={link.label} style={{ marginBottom: "0.75rem" }}>
                                        <Link
                                            href={link.href}
                                            style={{
                                                fontSize: "0.875rem",
                                                color: "#c6c6c6",
                                                textDecoration: "none",
                                                transition: "color 0.2s"
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = "#0f62fe"}
                                            onMouseLeave={(e) => e.currentTarget.style.color = "#c6c6c6"}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company Links */}
                        <div>
                            <h4 style={{
                                fontSize: "0.875rem",
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                color: "#8d8d8d",
                                marginBottom: "1rem"
                            }}>
                                Company
                            </h4>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {footerLinks.company.map((link) => (
                                    <li key={link.label} style={{ marginBottom: "0.75rem" }}>
                                        <Link
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                fontSize: "0.875rem",
                                                color: "#c6c6c6",
                                                textDecoration: "none",
                                                transition: "color 0.2s"
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = "#0f62fe"}
                                            onMouseLeave={(e) => e.currentTarget.style.color = "#c6c6c6"}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div style={{
                        paddingTop: "2rem",
                        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "1rem"
                    }}>
                        <p style={{
                            fontSize: "0.75rem",
                            color: "#8d8d8d",
                            margin: 0
                        }}>
                            © {currentYear} IBM Corporation. All rights reserved.
                        </p>
                        <p style={{
                            fontSize: "0.75rem",
                            color: "#8d8d8d",
                            margin: 0
                        }}>
                            Built with{" "}
                            <Link
                                href="https://carbondesignsystem.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: "#0f62fe",
                                    transition: "color 0.2s"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = "#78a9ff"}
                                onMouseLeave={(e) => e.currentTarget.style.color = "#0f62fe"}
                            >
                                IBM Carbon Design System
                            </Link>
                        </p>
                    </div>
                </Column>
            </Grid>
        </footer>
    );
}

// Made with Bob
