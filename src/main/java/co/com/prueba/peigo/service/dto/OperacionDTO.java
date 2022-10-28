package co.com.prueba.peigo.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.Data;

/**
 * A DTO for the {@link co.com.prueba.peigo.domain.Operacion} entity.
 */
@Data
public class OperacionDTO implements Serializable {

    private Long id;

    private String numeroOperacion;

    private Double monto;

    private String cuentaOrigen;

    private String cuentaDestino;
    
    private String usuarioCreacion;

    private Instant fechaCreacion;

    private String usuarioModificacion;

    private Instant fechaModificacion;
   
}
