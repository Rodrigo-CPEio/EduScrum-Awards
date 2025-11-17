package devapp.upt;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

/**
 * Represents an educational user with email and hashed password storage.
 * Passwords are stored as a SHA-256 Base64-encoded hash. This is a simple
 * option for the exercise; for production use prefer PBKDF2/BCrypt/Argon2.
 *
 * Author: Rodrigo Miguel dos Santos Sousa from QS_DevTeam - UPT
 * Version: 1.1
 */
public class Edu_User {

    // Instance attributes
    private String email;
    // store hashed password, not raw password
    private String passwordHash;
    private String name;

    /**
     * Complete constructor with all parameters; provided password is hashed.
     *
     * @param email the user's email
     * @param password the user's raw password (will be hashed)
     * @param name the user's name
     */
    public Edu_User(String email, String password, String name) {
        this.email = email;
        // avoid calling an overridable method from constructor
        this.passwordHash = (password == null) ? null : hashPassword(password);
        this.name = name;
    }

    // Getters and Setters
    /**
     * Returns the user's email address.
     *
     * @return the email
     */
    public String getEmail() {
        return email;
    }

    /**
     * Returns the stored password hash (Base64-encoded SHA-256). Use
     * {@link #verifyPassword(String)} to check a raw password.
     *
     * @return the password hash
     */
    public String getPasswordHash() {
        return passwordHash;
    }

    public String getName() {
        return name;
    }

    /**
     * Sets the user's email address.
     *
     * @param email the email to set
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * Sets the user's password by hashing the provided raw password.
     *
     * @param password the raw password to set
     */
    public void setPassword(String password) {
        if (password == null) {
            this.passwordHash = null;
        } else {
            this.passwordHash = hashPassword(password);
        }
    }

    /**
     * Sets the user's name.
     *
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Verifies a raw password against the stored password hash.
     *
     * @param rawPassword the raw password to verify
     * @return true if the password matches, false otherwise
     */
    public boolean verifyPassword(String rawPassword) {
        if (rawPassword == null && this.passwordHash == null) return true;
        if (rawPassword == null || this.passwordHash == null) return false;
        return hashPassword(rawPassword).equals(this.passwordHash);
    }

    private static String hashPassword(String raw) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(raw.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(digest);
        } catch (java.security.NoSuchAlgorithmException e) {
            throw new IllegalStateException("Unable to hash password", e);
        }
    }

    /**
     * Safe string representation that intentionally excludes the password.
     */
    @Override
    public String toString() {
        return "Edu_User{email='" + email + "', name='" + name + "'}";
    }
}
