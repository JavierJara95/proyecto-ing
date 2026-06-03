package cl.duoc.smaa.dto;

import cl.duoc.smaa.model.Rol;

public class LoginResponse {
    private boolean ok;
    private String mensaje;
    private Long usuarioId;
    private String nombre;
    private Rol rol;

    public LoginResponse(boolean ok, String mensaje, Long usuarioId, String nombre, Rol rol) {
        this.ok = ok;
        this.mensaje = mensaje;
        this.usuarioId = usuarioId;
        this.nombre = nombre;
        this.rol = rol;
    }
    public boolean isOk() { return ok; }
    public String getMensaje() { return mensaje; }
    public Long getUsuarioId() { return usuarioId; }
    public String getNombre() { return nombre; }
    public Rol getRol() { return rol; }
}
