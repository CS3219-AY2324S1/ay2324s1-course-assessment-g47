# Use Nginx as the production server
FROM nginx:stable-alpine

RUN rm /etc/nginx/conf.d/*

# Copy your project files to Nginx's directory
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]