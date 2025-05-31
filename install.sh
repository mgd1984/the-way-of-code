#!/bin/bash

# The Way of Code - Installation Script
# Easy setup for vibe-coding principles in your development environment

set -e

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
REPO_URL="https://raw.githubusercontent.com/mgd1984/the-way-of-code/main"
MCP_PACKAGE="the-way-of-code"

echo -e "${BLUE}"
echo "🌊 The Way of Code - Installation"
echo "═══════════════════════════════════"
echo -e "${NC}"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Not in a git repository. Some features will be limited.${NC}"
    IN_GIT_REPO=false
else
    IN_GIT_REPO=true
fi

# Function to install Cursor rules
install_cursor_rules() {
    echo -e "${GREEN}Installing Cursor rules...${NC}"
    
    if [ -f ".cursorrules" ]; then
        echo -e "${YELLOW}⚠️  .cursorrules already exists. Creating backup...${NC}"
        cp .cursorrules .cursorrules.backup
    fi
    
    curl -s "$REPO_URL/.cursor/rules/core-philosophy.mdc" > .cursorrules
    echo -e "${GREEN}✅ Cursor rules installed!${NC}"
    echo -e "${YELLOW}💡 Restart Cursor to apply the new rules.${NC}"
}

# Function to install MCP server
install_mcp_server() {
    echo -e "${GREEN}Installing MCP server...${NC}"
    
    if command -v npm &> /dev/null; then
        npm install -g "$MCP_PACKAGE"
        echo -e "${GREEN}✅ MCP server installed globally!${NC}"
        echo -e "${YELLOW}💡 Configure your MCP-compatible tools to use: $MCP_PACKAGE${NC}"
    else
        echo -e "${RED}❌ npm not found. Please install Node.js and npm first.${NC}"
        return 1
    fi
}

# Function to install git hooks
install_git_hooks() {
    if [ "$IN_GIT_REPO" = false ]; then
        echo -e "${YELLOW}⚠️  Not in a git repository. Skipping git hooks.${NC}"
        return 1
    fi
    
    echo -e "${GREEN}Installing git hooks...${NC}"
    
    # Create hooks directory if it doesn't exist
    mkdir -p .git/hooks
    
    # Install pre-commit hook
    curl -s "$REPO_URL/git-hooks/pre-commit" > .git/hooks/pre-commit
    chmod +x .git/hooks/pre-commit
    
    echo -e "${GREEN}✅ Git hooks installed!${NC}"
    echo -e "${YELLOW}💡 The Way of Code principles will now appear before each commit.${NC}"
}



# Function to create project documentation
create_project_docs() {
    echo -e "${GREEN}Creating project documentation...${NC}"
    
    if [ ! -f "WAY_OF_CODE.md" ]; then
        cat > WAY_OF_CODE.md << 'EOF'
# The Way of Code - Project Integration

This project follows The Way of Code principles for vibe-coding.

## Core Principles

1. **Simplicity Over Complexity** - Choose the simplest solution that works
2. **Flow Over Force** - Don't force solutions; let them emerge  
3. **Humility Over Ego** - Code without attachment to being "right"
4. **Balance Over Extremes** - Neither too rigid nor too loose
5. **Presence Over Rushing** - Code with full attention to the current task

## Daily Practice

- Begin coding sessions with intention and clarity
- Refactor continuously toward simplicity
- Code reviews focus on essence, not ego
- Embrace "I don't know" as the starting point for learning

## Resources

- [Full Text](https://github.com/mgd1984/the-way-of-code)
- [Complete Text](https://github.com/mgd1984/the-way-of-code/blob/main/text/complete.md)


---

*"The code that can be named is not the eternal code."*
EOF
        echo -e "${GREEN}✅ Project documentation created: WAY_OF_CODE.md${NC}"
    else
        echo -e "${YELLOW}⚠️  WAY_OF_CODE.md already exists. Skipping.${NC}"
    fi
}

# Main installation menu
show_menu() {
    echo -e "${GREEN}Choose installation options:${NC}"
    echo "1) Full installation (recommended)"
    echo "2) Cursor rules only"
    echo "3) MCP server only"
    echo "4) Git hooks only"

    echo "5) Project documentation only"
    echo "6) Custom selection"
    echo "0) Exit"
    echo ""
    read -p "Enter your choice [1]: " choice
    choice=${choice:-1}
}

# Custom selection menu
custom_selection() {
    echo -e "${GREEN}Select components to install:${NC}"
    echo "Enter 'y' for yes, 'n' for no, or press Enter for default"
    echo ""
    
    read -p "Install Cursor rules? [y]: " install_cursor
    install_cursor=${install_cursor:-y}
    
    read -p "Install MCP server? [y]: " install_mcp
    install_mcp=${install_mcp:-y}
    
    read -p "Install git hooks? [y]: " install_hooks
    install_hooks=${install_hooks:-y}
    
    
    
    read -p "Create project documentation? [y]: " create_docs
    create_docs=${create_docs:-y}
    
    echo ""
    
    [[ $install_cursor == "y" ]] && install_cursor_rules
    [[ $install_mcp == "y" ]] && install_mcp_server
    [[ $install_hooks == "y" ]] && install_git_hooks

    [[ $create_docs == "y" ]] && create_project_docs
}

# Main execution
show_menu

case $choice in
    1)
        echo -e "${GREEN}Installing all components...${NC}"
        install_cursor_rules
        install_mcp_server
        install_git_hooks
        create_project_docs
        ;;
    2)
        install_cursor_rules
        ;;
    3)
        install_mcp_server
        ;;
    4)
        install_git_hooks
        ;;
    5)
        create_project_docs
        ;;

    6)
        custom_selection
        ;;
    0)
        echo -e "${YELLOW}Installation cancelled.${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice. Exiting.${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}🌊 Installation complete!${NC}"
echo -e "${GREEN}The Way of Code is now integrated into your development environment.${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "• Restart your IDE to apply new configurations"

echo "• Commit some code to see the git hooks in action"
echo "• Visit: https://github.com/mgd1984/the-way-of-code for more resources"
echo ""
echo -e "${BLUE}May your code flow like water. 🌊${NC}" 