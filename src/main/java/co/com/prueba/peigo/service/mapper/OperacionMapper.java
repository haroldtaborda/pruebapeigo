package co.com.prueba.peigo.service.mapper;

import org.mapstruct.Mapper;

import co.com.prueba.peigo.domain.Operacion;
import co.com.prueba.peigo.service.dto.OperacionDTO;

/**
 * Mapper for the entity {@link Operacion} and its DTO {@link OperacionDTO}.
 */
@Mapper(componentModel = "spring")
public interface OperacionMapper extends EntityMapper<OperacionDTO, Operacion> {
	
}
