# Cross-platform Makefile for the-monkeys project
# Works on Windows, macOS, and Linux

.PHONY: dev build test lint format install-deps help setup-hosts

# Default target
all: dev

# Setup hosts file (one-time, requires sudo/admin)
setup-hosts:
ifeq ($(OS),Windows_NT)
	powershell -ExecutionPolicy Bypass -File "scripts/setup-hosts.ps1"
else
	bash scripts/setup-hosts.sh
endif

# Development server
dev:
	pnpm dev

# Build for production
build:
	pnpm build

# Run tests
test:
	pnpm test

# Run linter
lint:
	pnpm lint

# Format code
format:
	pnpm format

# Install dependencies
install-deps:
	pnpm install-deps

# Show help
help:
	@echo "Available targets:"
	@echo "  dev       - Start development server"
	@echo "  build     - Build project for production"
	@echo "  test      - Run tests"
	@echo "  lint      - Run linter"
	@echo "  format    - Format code"
	@echo "  install-deps - Install dependencies"
	@echo "  setup-hosts - Add 127.0.0.1 local.monkeys.com.co to /etc/hosts (one-time)"
	@echo "  help      - Show this help message"
