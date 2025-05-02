package com.mmbyown.truescandocumentscanner;

import android.os.Environment;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;

public class TrueScanStorageModule extends ReactContextBaseJavaModule {

    public TrueScanStorageModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "TrueScanStorage";
    }

    @ReactMethod
    public void createTrueScanDownloadFolder(Promise promise) {
        try {
            File downloadDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
            File trueScanFolder = new File(downloadDir, "TrueScan");

            if (!trueScanFolder.exists()) {
                boolean created = trueScanFolder.mkdirs();
                if (!created) {
                    promise.reject("CREATE_FAILED", "Failed to create /Download/TrueScan");
                    return;
                }
            }

            promise.resolve(trueScanFolder.getAbsolutePath());
        } catch (Exception e) {
            promise.reject("ERROR_CREATING_FOLDER", e.getMessage());
        }
    }
}
