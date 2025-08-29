#!/bin/bash

echo "🚀 AdZU SDU Development Setup"
echo "=============================="

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

# Install frontend dependencies  
echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🏃 To start development:"
echo "  npm run dev"
echo ""
echo "🏗️  To build for production:"
echo "  npm run build"
echo ""
echo "📚 Login credentials:"
echo "  sdo@adzu.edu.ph / sdo123"
echo "  cces@adzu.edu.ph / cces123"
echo "  api@adzu.edu.ph / api123"
echo "  etc..."
