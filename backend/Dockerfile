# Multi-stage build to keep the final image size minimal
FROM python:3.13-slim AS builder

WORKDIR /app

# Install system build dependencies for compiling psycopg2
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install uv using standard python pip to avoid registry/external fetch errors
RUN pip install --no-cache-dir uv

# Set environment variables for uv and python
ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    PYTHONUNBUFFERED=1

# Copy uv lock and configuration files
COPY pyproject.toml uv.lock ./

# Install project dependencies in a virtual environment (excluding dev dependencies)
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-install-project --no-dev

# Copy the rest of the application files
COPY . .

# Run sync again to install the application project itself (if package is defined)
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev


# Runtime stage
FROM python:3.13-slim

WORKDIR /app

# Install runtime dependencies (like libpq for PostgreSQL connectivity)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy the application and virtual environment from builder stage
COPY --from=builder /app /app

# Place the virtual environment's bin folder at the front of the PATH
ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1

# Hugging Face Spaces runs containers as a non-root user with UID 1000.
# We create a matching user 'user' and switch to it.
RUN useradd -m -u 1000 user && \
    chown -R user:user /app
USER user

# Hugging Face Spaces expects the container to listen on port 7860.
EXPOSE 7860

# Start the application using uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
