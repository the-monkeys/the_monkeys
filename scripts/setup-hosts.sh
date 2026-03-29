#!/bin/bash
# Script to add local.monkeys.com.co to /etc/hosts
# Works on macOS and Linux

HOSTS_FILE="/etc/hosts"
ENTRY="127.0.0.1 local.monkeys.com.co"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "This script requires admin privileges. Requesting sudo..."
    sudo "$0"
    exit
fi

# Check if entry already exists
if grep -q "local.monkeys.com.co" "$HOSTS_FILE"; then
    echo "Entry already exists in hosts file"
    exit 0
fi

# Add the entry
echo "$ENTRY" >> "$HOSTS_FILE"
echo "Successfully added '$ENTRY' to $HOSTS_FILE"
