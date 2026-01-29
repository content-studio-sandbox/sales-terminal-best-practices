# FSM Technical Best Practices

A comprehensive web application for teaching terminal, Git, and SSH best practices to FSM sales teams. Built with React, TypeScript, and IBM Carbon Design System.

## Features

- **Interactive Terminal Simulator**: Safe, simulated terminal environment for hands-on practice
- **Terminal Basics Guide**: Comprehensive documentation with visual diagrams
- **Git Workflows**: Best practices for version control
- **SSH Best Practices**: Security and connection guides
- **Professional UI**: IBM Carbon Design System components
- **OpenShift Ready**: Fully containerized and production-ready

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at: http://localhost:8081

### Build for Production

```bash
npm run build
```

## Project Structure

```
sales-terminal-best-practices/
├── src/
│   ├── components/
│   │   ├── InteractiveTerminal.tsx    # Simulated terminal component
│   │   └── VisualDiagram.tsx          # ASCII diagram component
│   ├── pages/
│   │   ├── LandingPage.tsx            # Home page
│   │   ├── TerminalBasicsPage.tsx     # Terminal documentation
│   │   ├── GitWorkflowsPage.tsx       # Git best practices
│   │   ├── SSHBestPracticesPage.tsx   # SSH guides
│   │   └── InteractiveTerminalPage.tsx # Practice terminal
│   ├── layout/
│   │   ├── AppHeader.tsx              # Navigation header
│   │   └── AppFooter.tsx              # Footer
│   └── App.tsx                        # Main app component
├── public/                            # Static assets
└── package.json                       # Dependencies
```

## Available Commands in Simulated Terminal

The interactive terminal supports these commands:

- `help` - Show all available commands
- `ls` - List files and directories
- `cd [dir]` - Change directory
- `pwd` - Print working directory
- `mkdir [name]` - Create directory
- `touch [name]` - Create file
- `cat [file]` - Display file contents
- `echo [text]` - Echo text
- `whoami` - Display current user
- `date` - Show current date/time
- `git status` - Show git status (demo)
- `git log` - Show git log (demo)
- `ssh demo` - Demo SSH connection
- `history` - Show command history
- `clear` - Clear terminal

## Deployment

### OpenShift Deployment

This application is designed to run in OpenShift/Kubernetes:

```bash
# Build container
docker build -t fsm-terminal-best-practices .

# Deploy to OpenShift
oc new-app fsm-terminal-best-practices
oc expose svc/fsm-terminal-best-practices
```

### Environment Variables

No environment variables required - the app is fully self-contained.

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **IBM Carbon Design System** - UI components
- **xterm.js** - Terminal emulator
- **React Router** - Client-side routing

## Security

- ✅ **Safe Simulation**: Terminal is fully simulated - no real system access
- ✅ **No Backend Required**: Pure frontend application
- ✅ **OpenShift Compatible**: Runs in containerized environments
- ✅ **No Sensitive Data**: No authentication or data storage

## Development

### Adding New Commands

Edit `src/components/InteractiveTerminal.tsx`:

```typescript
const commands: Record<string, (args?: string) => string> = {
  mycommand: (args) => {
    // Your command logic here
    return "Command output";
  }
};
```

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/layout/AppHeader.tsx`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

IBM Internal Use Only

## Support

For questions or issues, contact the FSM Technical Training team.