package com.debu.prescriptoVault.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.debu.prescriptoVault.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URI;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private final Cloudinary cloudinary;
    private final String cloudName;
    private final String apiKey;
    private final String apiSecret;
    private final String folder;

    public FileStorageServiceImpl(@Value("${cloudinary.cloud-name}") String cloudName,
                                  @Value("${cloudinary.api-key}") String apiKey,
                                  @Value("${cloudinary.api-secret}") String apiSecret,
                                  @Value("${cloudinary.folder}") String folder) {
        this.cloudName = cloudName;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
        ));
        this.folder = folder;
    }

    @Override
    public String storeFile(MultipartFile file, String filename) throws IOException {
        validateCloudinaryConfig();

        if (file == null || file.isEmpty()) {
            throw new IOException("Please select a PDF file to upload");
        }

        String clean = StringUtils.cleanPath(filename == null ? "" : filename);
        if (clean.contains("..")) {
            throw new IOException("Invalid file name");
        }

        String contentType = file.getContentType();
        if (!clean.toLowerCase(Locale.ROOT).endsWith(".pdf") || !"application/pdf".equalsIgnoreCase(contentType)) {
            throw new IOException("Only PDF files are allowed");
        }

        String publicId = UUID.randomUUID() + "_" + clean.substring(0, clean.length() - 4);

        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", folder,
                    "public_id", publicId,
                    "resource_type", "raw",
                    "overwrite", false
            ));

            Object secureUrl = uploadResult.get("secure_url");
            if (secureUrl == null) {
                throw new IOException("Cloudinary upload did not return a secure URL");
            }
            return secureUrl.toString();
        } catch (RuntimeException e) {
            throw new IOException("Cloudinary upload failed: " + e.getMessage(), e);
        }
    }

    @Override
    public Resource loadFileAsResource(String filepath) throws MalformedURLException {
        if (filepath == null || filepath.isBlank()) return null;
        if (filepath.startsWith("http://") || filepath.startsWith("https://")) {
            return new UrlResource(URI.create(filepath));
        }

        Path p = Paths.get(filepath).toAbsolutePath().normalize();
        Resource resource = new UrlResource(p.toUri());
        if (resource.exists()) return resource;
        return null;
    }

    private void validateCloudinaryConfig() throws IOException {
        if (isBlank(cloudName) || isBlank(apiKey) || isBlank(apiSecret)) {
            throw new IOException("Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
