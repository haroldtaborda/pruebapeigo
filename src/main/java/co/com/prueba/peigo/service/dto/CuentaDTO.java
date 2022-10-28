package co.com.prueba.peigo.service.dto;

import java.io.Serializable;
import java.time.Instant;

import co.com.prueba.peigo.domain.enumeration.TipoCuenta;
import lombok.Data;

/**
 * A DTO for the {@link co.com.prueba.peigo.domain.Cuenta} entity.
 */
@Data
public class CuentaDTO implements Serializable {

    private Long id;

    private String numeroCuenta;

    private Double saldo;

    private TipoCuenta tipoCuenta;

    private String usuarioCreacion;

    private Instant fechaCreacion;

    private String usuarioModificacion;

    private Instant fechaModificacion;
   
}
