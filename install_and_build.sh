echo "Installing dependencies..."
# Install or update nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

node -v
# Install the latest version of Node.js
nvm install node

# Use the latest version
nvm use node

bun install

echo "Building the project..."
bun run build



echo "Installation and build completed."
