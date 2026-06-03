package cl.duoc.smaa.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    @Email(message = "El correo no tiene un formato válido")
    @NotBlank(message = "El correo es obligatorio")
    private String correo;

    @NotBlank(message = "La password es obligatoria")
    private String password;

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
