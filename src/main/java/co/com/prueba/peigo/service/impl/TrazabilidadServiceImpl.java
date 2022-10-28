package co.com.prueba.peigo.service.impl;

import java.time.Instant;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import co.com.prueba.peigo.domain.Operacion;
import co.com.prueba.peigo.domain.Trazabilidad;
import co.com.prueba.peigo.repository.TrazabilidadRepository;
import co.com.prueba.peigo.service.TrazabilidadService;
import co.com.prueba.peigo.service.dto.TrazabilidadDTO;
import co.com.prueba.peigo.service.mapper.TrazabilidadMapper;

/**
 * Service Implementation for managing {@link Operacion}.
 */
@Service
@Transactional
public class TrazabilidadServiceImpl implements TrazabilidadService {

    private final Logger log = LoggerFactory.getLogger(TrazabilidadServiceImpl.class);

    private final  TrazabilidadRepository trazabilidadRepository;

    private final  TrazabilidadMapper trazabilidadMapper;

    public TrazabilidadServiceImpl(TrazabilidadRepository trazabilidadRepository, TrazabilidadMapper trazabilidadMapper) {
        this.trazabilidadRepository = trazabilidadRepository;
        this.trazabilidadMapper = trazabilidadMapper;
    }

    @Override
    public TrazabilidadDTO save(TrazabilidadDTO operacionDTO) {
        log.debug("Request to save Operacion : {}", operacionDTO);
        operacionDTO.setFechaCreacion(Instant.now());
        Trazabilidad operacion = trazabilidadMapper.toEntity(operacionDTO);
        operacion.setFechaCreacion(Instant.now());
        operacion = trazabilidadRepository.save(operacion);
        return trazabilidadMapper.toDto(operacion);
    }


    @Override
    @Transactional(readOnly = true)
    public List<TrazabilidadDTO> findAll() {
        log.debug("Request to get all Operacions");
        return trazabilidadRepository.findAll().stream().map(trazabilidadMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

}
