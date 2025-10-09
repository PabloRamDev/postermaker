FROM debian:bookworm-slim

ENV PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive

# Install Python 3.11 and system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    build-essential \
    libgraphicsmagick++1-dev \
    libboost-python1.74-dev \
    libboost-system1.74-dev \
    libboost-thread1.74-dev \
    graphicsmagick \
    wkhtmltopdf \
    fontconfig \
    libjpeg-dev \
    libpng-dev \
    libxrender1 \
    libxext6 \
    xfonts-75dpi \
    xfonts-base \
    && ln -s /usr/bin/python3 /usr/bin/python \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

# Install Python dependencies (use --break-system-packages for Debian 12)
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["gunicorn", "postermaker.wsgi:application", "--bind", "0.0.0.0:8000"]