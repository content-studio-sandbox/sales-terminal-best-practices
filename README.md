# Sales Terminal Best Practices

An interactive web application designed to teach IBM Sales teams essential terminal, Git, and SSH skills for modern development workflows.

## 🚀 Features

- **Terminal Basics**: Learn essential command-line navigation and file operations
- **Git Workflows**: Master version control with practical Git commands and best practices
- **SSH Best Practices**: Understand secure remote server connections and key management
- **Interactive Terminal**: Practice commands in a safe, simulated terminal environment

## 📋 Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd sales-terminal-best-practices
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 📦 Technologies

- **React 18** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **IBM Carbon Design System** - Enterprise-grade UI components
- **xterm.js** - Terminal emulator for interactive practice
- **React Router** - Client-side routing

## 🎯 Usage

### For Sales Teams

1. **Start with Terminal Basics** - Learn fundamental commands
2. **Progress to Git Workflows** - Understand version control
3. **Master SSH Best Practices** - Secure remote connections
4. **Practice in Interactive Terminal** - Apply your knowledge safely

### For Developers

The application is built with a modular structure:

```
src/
├── components/          # Reusable components
│   └── InteractiveTerminal.tsx
├── pages/              # Main application pages
│   ├── TerminalBasicsPage.tsx
│   ├── GitWorkflowsPage.tsx
│   ├── SSHBestPracticesPage.tsx
│   └── InteractiveTerminalPage.tsx
├── layout/             # Layout components
│   ├── AppHeader.tsx
│   ├── AppFooter.tsx
│   └── MainLayout.tsx
└── App.tsx            # Main application component
```

## 🔧 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🎨 Customization

### Adding New Commands to Interactive Terminal

Edit `src/components/InteractiveTerminal.tsx` and add to the `commands` object:

```typescript
const commands: Record<string, () => string> = {
  // Add your custom command
  mycommand: () => "Output of my command",
  // ...
};
```

### Adding New Pages

1. Create a new page component in `src/pages/`
2. Add the route in `src/App.tsx`
3. Update navigation in `src/layout/AppHeader.tsx`

## 📚 Learning Path

### Beginner
- Terminal Basics: Navigation, file operations
- Basic Git commands: clone, status, add, commit

### Intermediate
- Git branching and merging
- SSH key generation and management
- Interactive terminal practice

### Advanced
- Complex Git workflows
- SSH configuration files
- Advanced terminal operations

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or issues:
- Open an issue in the repository
- Contact the development team
- Check the documentation in each section

## 🎓 Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [SSH Academy](https://www.ssh.com/academy/ssh)
- [IBM Carbon Design System](https://carbondesignsystem.com/)
- [Terminal Command Reference](https://ss64.com/)

## 🔐 Security Note

This application uses a simulated terminal environment. All commands are safe to practice and do not affect your actual system. When working with real terminals and servers, always:

- Use strong SSH keys
- Never share private keys
- Follow your organization's security policies
- Test commands in development environments first

---

Built with ❤️ for IBM Sales Teams using IBM Carbon Design System