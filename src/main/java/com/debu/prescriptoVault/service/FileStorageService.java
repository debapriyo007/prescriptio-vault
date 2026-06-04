package com.debu.prescriptoVault.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;

public interface FileStorageService {
    String storeFile(MultipartFile file, String filename) throws IOException;
    Resource loadFileAsResource(String filepath) throws MalformedURLException;
}
