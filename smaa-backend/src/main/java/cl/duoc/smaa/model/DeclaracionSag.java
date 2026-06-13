package cl.duoc.smaa.model;

import jakarta.persistence.*;

@Entity
@Table(name = "declaraciones_sag")
public class DeclaracionSag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Boolean declaraProductos = false;
    private String tipoProducto;
    private Boolean productoRestringido = false;

    @Column(length = 1000)
    private String observacion;

    @Enumerated(EnumType.STRING)
    private EstadoRevisionSag estadoRevision = EstadoRevisionSag.SIN_ALERTA;



    @Column(length = 512)
    private String archivoRespaldoNombre;

    @Column(length = 255)
    private String archivoRespaldoTipo;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String archivoRespaldoDatos;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "declaracion_id")
    private DeclaracionViaje declaracionViaje;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Boolean getDeclaraProductos() { return declaraProductos; }
    public void setDeclaraProductos(Boolean declaraProductos) { this.declaraProductos = declaraProductos; }
    public String getTipoProducto() { return tipoProducto; }
    public void setTipoProducto(String tipoProducto) { this.tipoProducto = tipoProducto; }
    public Boolean getProductoRestringido() { return productoRestringido; }
    public void setProductoRestringido(Boolean productoRestringido) { this.productoRestringido = productoRestringido; }
    public String getObservacion() { return observacion; }
    public void setObservacion(String observacion) { this.observacion = observacion; }
    public EstadoRevisionSag getEstadoRevision() { return estadoRevision; }
    public void setEstadoRevision(EstadoRevisionSag estadoRevision) { this.estadoRevision = estadoRevision; }
    public DeclaracionViaje getDeclaracionViaje() { return declaracionViaje; }
    public void setDeclaracionViaje(DeclaracionViaje declaracionViaje) { this.declaracionViaje = declaracionViaje; }

    public String getArchivoRespaldoNombre() { return archivoRespaldoNombre; }
    public void setArchivoRespaldoNombre(String archivoRespaldoNombre) { this.archivoRespaldoNombre = limitarTexto(archivoRespaldoNombre, 180); }
    public String getArchivoRespaldoTipo() { return archivoRespaldoTipo; }
    public void setArchivoRespaldoTipo(String archivoRespaldoTipo) { this.archivoRespaldoTipo = archivoRespaldoTipo; }
    public String getArchivoRespaldoDatos() { return archivoRespaldoDatos; }
    public void setArchivoRespaldoDatos(String archivoRespaldoDatos) { this.archivoRespaldoDatos = archivoRespaldoDatos; }

    private String limitarTexto(String valor, int maximo) {
        if (valor == null) return null;
        String limpio = valor.trim();
        if (limpio.length() <= maximo) return limpio;

        int ultimoPunto = limpio.lastIndexOf('.');
        String extension = ultimoPunto > 0 ? limpio.substring(ultimoPunto) : "";
        if (extension.length() > 20) extension = extension.substring(0, 20);
        int maxBase = Math.max(20, maximo - extension.length() - 12);
        String base = ultimoPunto > 0 ? limpio.substring(0, ultimoPunto) : limpio;
        return base.substring(0, Math.min(base.length(), maxBase)) + "_recortado" + extension;
    }
}