package co.com.prueba.peigo.service.mapper;

import org.mapstruct.Mapper;

import co.com.prueba.peigo.domain.Cuenta;
import co.com.prueba.peigo.service.dto.CuentaDTO;

/**
 * Mapper for the entity {@link Cuenta} and its DTO {@link CuentaDTO}.
 */
@Mapper(componentModel = "spring")
public interface CuentaMapper extends EntityMapper<CuentaDTO, Cuenta> {
   
}
