#!/bin/bash

# The Way of Code - Installation
set -e

# Colors for minimal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m' 
RED='\033[0;31m'
NC='\033[0m'

REPO_URL="https://raw.githubusercontent.com/mgd1984/the-way-of-code/main"
MCP_PACKAGE="the-way-of-code"

echo -e "${GREEN}The Way of Code${NC}"
echo "───────────────"

# Check git repository
IN_GIT_REPO=$(git rev-parse --git-dir > /dev/null 2>&1 && echo true || echo false)

# Install Cursor rules
install_cursor_rules() {
    echo "Installing Cursor rules..."
    
    [ -f ".cursorrules" ] && cp .cursorrules .cursorrules.backup
    curl -s "$REPO_URL/.cursor/rules/core-philosophy.mdc" > .cursorrules
    
    echo -e "${GREEN}✓ Cursor rules installed${NC}"
}

# Install MCP server
install_mcp_server() {
    echo "Installing MCP server..."
    
    if command -v npm &> /dev/null; then
        npm install -g "$MCP_PACKAGE"
        echo -e "${GREEN}✓ MCP server installed${NC}"
    else
        echo -e "${RED}npm required${NC}"
        return 1
    fi
}

# Install git hooks
install_git_hooks() {
    [ "$IN_GIT_REPO" = false ] && return 1
    
    echo "Installing git hooks..."
    
    mkdir -p .git/hooks
    curl -s "$REPO_URL/git-hooks/pre-commit" > .git/hooks/pre-commit
    chmod +x .git/hooks/pre-commit
    
    echo -e "${GREEN}✓ Git hooks installed${NC}"
}

# Create documentation
create_project_docs() {
    [ -f "WAY_OF_CODE.md" ] && return 0
    
    echo "Creating documentation..."
    
    cat > WAY_OF_CODE.md << 'EOF'
# The Way of Code

*Principles for this project*

## The Five Pillars

**Simplicity** over complexity  
**Flow** over force  
**Humility** over ego  
**Balance** over extremes  
**Presence** over rushing

## Practice

Begin with intention. Refactor toward simplicity. Code without attachment.

Embrace "I don't know" as the starting point for learning.

---

*"The code that can be named is not the eternal code."*
EOF
    
    echo -e "${GREEN}✓ Documentation created${NC}"
}

# Menu
show_menu() {
    echo
    echo "1) Full installation"
    echo "2) Cursor rules"  
    echo "3) MCP server"
    echo "4) Git hooks"
    echo "5) Documentation"
    echo "0) Exit"
    echo
    read -p "Choice [1]: " choice
    choice=${choice:-1}
}

# Execute
show_menu

case $choice in
    1) install_cursor_rules; install_mcp_server; install_git_hooks; create_project_docs ;;
    2) install_cursor_rules ;;
    3) install_mcp_server ;;
    4) install_git_hooks ;;
    5) create_project_docs ;;
    0) exit 0 ;;
    *) echo -e "${RED}Invalid choice${NC}"; exit 1 ;;
esac

echo
echo -e "${GREEN}Installation complete${NC}"
echo
echo -e "${YELLOW}Next steps:${NC}"
echo "• Configure your AI assistant with: npx the-way-of-code"
echo "• Reference: @github:mgd1984/the-way-of-code"
echo
echo "*The way is shown, not explained.*" 