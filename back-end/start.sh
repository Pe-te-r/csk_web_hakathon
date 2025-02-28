#!/bin/bash
cd back-end  # Move into the backend directory
gunicorn --bind 0.0.0.0:8000 app:app
