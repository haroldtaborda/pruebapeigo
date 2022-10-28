package co.com.prueba.peigo.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;

/**
 * A Operacion.
 */
@Data
public class TrazabilidadDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String request;
    
    private String response;

    private String proceso;
    
    private String usuarioCreacion;

    private Instant fechaCreacion;



}
