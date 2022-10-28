package co.com.prueba.peigo.service.mapper;

import org.mapstruct.Mapper;

import co.com.prueba.peigo.domain.Operacion;
import co.com.prueba.peigo.domain.Trazabilidad;
import co.com.prueba.peigo.service.dto.OperacionDTO;
import co.com.prueba.peigo.service.dto.TrazabilidadDTO;

/**
 * Mapper for the entity {@link Operacion} and its DTO {@link OperacionDTO}.
 */
@Mapper(componentModel = "spring")
public interface TrazabilidadMapper extends EntityMapper<TrazabilidadDTO, Trazabilidad> {
	
}
