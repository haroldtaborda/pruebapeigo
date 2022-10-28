package co.com.prueba.peigo.service.impl;

import java.time.Instant;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.gson.Gson;

import co.com.prueba.peigo.domain.Cuenta;
import co.com.prueba.peigo.repository.CuentaRepository;
import co.com.prueba.peigo.service.CuentaService;
import co.com.prueba.peigo.service.TrazabilidadService;
import co.com.prueba.peigo.service.dto.CuentaDTO;
import co.com.prueba.peigo.service.dto.TrazabilidadDTO;
import co.com.prueba.peigo.service.mapper.CuentaMapper;

/**
 * Service Implementation for managing {@link Cuenta}.
 */
@Service
@Transactional
public class CuentaServiceImpl implements CuentaService {

    private final Logger log = LoggerFactory.getLogger(CuentaServiceImpl.class);

    private final CuentaRepository cuentaRepository;

    private final CuentaMapper cuentaMapper;
    
    private final TrazabilidadService trazabilidadService;
    
    Gson gson = new Gson();

    public CuentaServiceImpl(CuentaRepository cuentaRepository, CuentaMapper cuentaMapper, TrazabilidadService trazabilidadService) {
        this.cuentaRepository = cuentaRepository;
        this.cuentaMapper = cuentaMapper;
		this.trazabilidadService = trazabilidadService;
    }

    @Override
    public CuentaDTO save(CuentaDTO cuentaDTO) {
        log.debug("Request to save Cuenta : {}", cuentaDTO);
        Cuenta cuenta = cuentaMapper.toEntity(cuentaDTO);
        cuenta.setFechaCreacion(Instant.now());
        cuenta = cuentaRepository.save(cuenta);
        //se registra trazabilidad del proceso
        trazabilidadService.save(crearRegistroAuditoria(cuentaDTO, cuenta));
        return cuentaMapper.toDto(cuenta);
    }

    @Override
    public CuentaDTO cargarCuenta(CuentaDTO cuentaDTO, String operacion) {
        log.debug("Request to cargarCuenta Cuenta : {}", cuentaDTO);
        Optional<Cuenta> cuenta = cuentaRepository.findById(cuentaDTO.getId());
        cuenta.get().setUsuarioModificacion(cuentaDTO.getUsuarioModificacion());
        if(operacion.equals("cargar")) {
        cuenta.get().setSaldo(cuenta.get().getSaldo()+cuentaDTO.getSaldo());
        }
        else {
        	cuenta.get().setSaldo(cuenta.get().getSaldo()-cuentaDTO.getSaldo());
        }
        return update(cuentaMapper.toDto(cuenta.get()));
    }
    private TrazabilidadDTO crearRegistroAuditoria(CuentaDTO cuentaDTO, Cuenta cuenta) {
    	TrazabilidadDTO dto = new TrazabilidadDTO();
    	//dto.setRequest(gson.toJson(cuentaDTO));
    	//dto.setResponse(gson.toJson(cuenta));
    	dto.setProceso(cuentaDTO.getId() != null ? "ACTUALIZACION CUENTA" : "CREACION CUENTA");
    	dto.setUsuarioCreacion(cuentaDTO.getId() != null ? cuentaDTO.getUsuarioModificacion() : cuentaDTO.getUsuarioModificacion());
		return dto;
	}

	@Override
    public CuentaDTO update(CuentaDTO cuentaDTO) {
        log.debug("Request to save Cuenta : {}", cuentaDTO);
        Cuenta cuenta = cuentaMapper.toEntity(cuentaDTO);
        cuenta = cuentaRepository.save(cuenta);
        cuenta.setFechaModificacion(Instant.now());
        //se registra trazabilidad del proceso
        trazabilidadService.save(crearRegistroAuditoria(cuentaDTO, cuenta));
        return cuentaMapper.toDto(cuenta);
    }

    @Override
    public Optional<CuentaDTO> partialUpdate(CuentaDTO cuentaDTO) {
        log.debug("Request to partially update Cuenta : {}", cuentaDTO);

        return cuentaRepository
            .findById(cuentaDTO.getId())
            .map(existingCuenta -> {
                cuentaMapper.partialUpdate(existingCuenta, cuentaDTO);

                return existingCuenta;
            })
            .map(cuentaRepository::save)
            .map(cuentaMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CuentaDTO> findAll() {
        log.debug("Request to get all Cuentas");
        return cuentaRepository.findAll().stream().map(cuentaMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CuentaDTO> findOne(Long id) {
        log.debug("Request to get Cuenta : {}", id);
        return cuentaRepository.findById(id).map(cuentaMapper::toDto);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<CuentaDTO> findByNumber(String numeroCuenta) {
        log.debug("Request to get Cuenta : {}", numeroCuenta);
        return cuentaRepository.findByNumber(numeroCuenta).map(cuentaMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Cuenta : {}", id);
        cuentaRepository.deleteById(id);
    }

	@Override
	public List<CuentaDTO> consultarCuentasNumero(String numero, String usuario) {
		if(numero.isEmpty() || numero.equals("TODAS")) {
			return cuentaRepository.findByUsuario(usuario ).stream().map(cuentaMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
		}
		else {
		  return cuentaRepository.findByNumeroLike("%" +numero.toUpperCase() + "%", usuario ).stream().map(cuentaMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
		}
		}
}
