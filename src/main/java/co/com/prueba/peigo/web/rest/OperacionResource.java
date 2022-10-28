package co.com.prueba.peigo.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import co.com.prueba.peigo.domain.Cuenta;
import co.com.prueba.peigo.repository.CuentaRepository;
import co.com.prueba.peigo.repository.OperacionRepository;
import co.com.prueba.peigo.service.OperacionService;
import co.com.prueba.peigo.service.dto.OperacionDTO;
import co.com.prueba.peigo.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link co.com.prueba.peigo.domain.Operacion}.
 */
@RestController
@RequestMapping("/api")
public class OperacionResource {

	private final Logger log = LoggerFactory.getLogger(OperacionResource.class);

	private static final String ENTITY_NAME = "operacion";

	@Value("${jhipster.clientApp.name}")
	private String applicationName;

	private final OperacionService operacionService;

	private final OperacionRepository operacionRepository;

	private final CuentaRepository cuentaRepository;

	public OperacionResource(OperacionService operacionService, OperacionRepository operacionRepository,
			CuentaRepository cuentaRepository) {
		this.operacionService = operacionService;
		this.operacionRepository = operacionRepository;
		this.cuentaRepository = cuentaRepository;
	}

	/**
	 * {@code POST  /operacions} : Create a new operacion.
	 *
	 * @param operacionDTO the operacionDTO to create.
	 * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
	 *         body the new operacionDTO, or with status {@code 400 (Bad Request)}
	 *         if the operacion has already an ID.
	 * @throws URISyntaxException if the Location URI syntax is incorrect.
	 */
	@PostMapping("/operacions")
	public ResponseEntity<OperacionDTO> createOperacion(@RequestBody OperacionDTO operacionDTO)
			throws URISyntaxException {
		log.debug("REST request to save Operacion : {}", operacionDTO);
		if (operacionDTO.getId() != null) {
			throw new BadRequestAlertException("A new operacion cannot already have an ID", ENTITY_NAME, "idexists");
		}
		if (operacionDTO.getCuentaDestino().equals(operacionDTO.getCuentaOrigen())) {
			throw new BadRequestAlertException("Las cuentas no pueden ser iguales ", "cuentas", "cuentasIguales");
		}
		Optional<Cuenta> cuenta = cuentaRepository.findByNumber(operacionDTO.getCuentaOrigen());
		if (!cuenta.isPresent()) {
			throw new BadRequestAlertException("No se encontro la cuenta origen", "cuenta", "cuentaOrigen");
		}
		if (cuenta.get().getSaldo() < operacionDTO.getMonto()) {
			throw new BadRequestAlertException("La cuenta no tiene fondos suficientes para la operación", ENTITY_NAME,
					"saldoCuenta");
		}
		cuenta = cuentaRepository.findByNumber(operacionDTO.getCuentaDestino());
		if (!cuenta.isPresent()) {
			throw new BadRequestAlertException("No se encontro la cuenta destino", "cuenta", "cuentaDestino");
		}

		OperacionDTO result = operacionService.save(operacionDTO);
		// Armar mensaje resultante
		StringBuilder mensajeResultante = new StringBuilder();
		mensajeResultante.append("La operación " + result.getNumeroOperacion() + " fue realizada exitosamente")
				.append(", ");
		cuenta = cuentaRepository.findByNumber(operacionDTO.getCuentaOrigen());
		mensajeResultante.append(
				"La cuenta origen " + operacionDTO.getCuentaOrigen() + " tiene un saldo de:" + cuenta.get().getSaldo())
				.append(", ");
		cuenta = cuentaRepository.findByNumber(operacionDTO.getCuentaDestino());
		mensajeResultante.append(
				"La cuenta destino" + operacionDTO.getCuentaDestino() + " tiene un saldo de:" + cuenta.get().getSaldo());
				
		return ResponseEntity
				.created(new URI("/api/operacions/" + result.getId())).headers(HeaderUtil
						.createEntityCreationAlert(applicationName, true, ENTITY_NAME, mensajeResultante.toString()))
				.body(result);
	}

	/**
	 * {@code PUT  /operacions/:id} : Updates an existing operacion.
	 *
	 * @param id           the id of the operacionDTO to save.
	 * @param operacionDTO the operacionDTO to update.
	 * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
	 *         the updated operacionDTO, or with status {@code 400 (Bad Request)} if
	 *         the operacionDTO is not valid, or with status
	 *         {@code 500 (Internal Server Error)} if the operacionDTO couldn't be
	 *         updated.
	 * @throws URISyntaxException if the Location URI syntax is incorrect.
	 */
	@PutMapping("/operacions/{id}")
	public ResponseEntity<OperacionDTO> updateOperacion(@PathVariable(value = "id", required = false) final Long id,
			@RequestBody OperacionDTO operacionDTO) throws URISyntaxException {
		log.debug("REST request to update Operacion : {}, {}", id, operacionDTO);
		if (operacionDTO.getId() == null) {
			throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
		}
		if (operacionDTO.getCuentaDestino().equals(operacionDTO.getCuentaOrigen())) {
			throw new BadRequestAlertException("Las cuentas no pueden ser iguales ", "cuentas", "cuentasIguales");
		}
		if (!Objects.equals(id, operacionDTO.getId())) {
			throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
		}

		if (!operacionRepository.existsById(id)) {
			throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
		}

		Optional<Cuenta> cuenta = cuentaRepository.findByNumber(operacionDTO.getCuentaOrigen());
		if (!cuenta.isPresent()) {
			throw new BadRequestAlertException("No se encontro la cuenta origen", "cuenta", "cuentaOrigen");
		}
		if (cuenta.get().getSaldo() < operacionDTO.getMonto()) {
			throw new BadRequestAlertException("La cuenta no tiene fondos suficientes para la operación", ENTITY_NAME,
					"saldoCuenta");
		}
		cuenta = cuentaRepository.findByNumber(operacionDTO.getCuentaDestino());
		if (!cuenta.isPresent()) {
			throw new BadRequestAlertException("No se encontro la cuenta destino", "cuenta", "cuentaDestino");
		}

		OperacionDTO result = operacionService.update(operacionDTO);
		// Armar mensaje resultante
		StringBuilder mensajeResultante = new StringBuilder();
		mensajeResultante.append("La operación " + result.getNumeroOperacion() + " fue realizada exitosamente")
				.append(", ");
		cuenta = cuentaRepository.findByNumber(operacionDTO.getCuentaOrigen());
		mensajeResultante.append(
				"La cuenta origen " + operacionDTO.getCuentaOrigen() + " tiene un saldo de:" + cuenta.get().getSaldo())
				.append(", ");
		cuenta = cuentaRepository.findByNumber(operacionDTO.getCuentaDestino());
		mensajeResultante.append(
				"La cuenta destino" + operacionDTO.getCuentaDestino() + " tiene un saldo de:" + cuenta.get().getSaldo());
				
		return ResponseEntity.ok().headers(
				HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mensajeResultante.toString()))
				.body(result);
	}

	/**
	 * {@code PATCH  /operacions/:id} : Partial updates given fields of an existing
	 * operacion, field will ignore if it is null
	 *
	 * @param id           the id of the operacionDTO to save.
	 * @param operacionDTO the operacionDTO to update.
	 * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
	 *         the updated operacionDTO, or with status {@code 400 (Bad Request)} if
	 *         the operacionDTO is not valid, or with status {@code 404 (Not Found)}
	 *         if the operacionDTO is not found, or with status
	 *         {@code 500 (Internal Server Error)} if the operacionDTO couldn't be
	 *         updated.
	 * @throws URISyntaxException if the Location URI syntax is incorrect.
	 */
	@PatchMapping(value = "/operacions/{id}", consumes = { "application/json", "application/merge-patch+json" })
	public ResponseEntity<OperacionDTO> partialUpdateOperacion(
			@PathVariable(value = "id", required = false) final Long id, @RequestBody OperacionDTO operacionDTO)
			throws URISyntaxException {
		log.debug("REST request to partial update Operacion partially : {}, {}", id, operacionDTO);
		if (operacionDTO.getId() == null) {
			throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
		}
		if (!Objects.equals(id, operacionDTO.getId())) {
			throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
		}

		if (!operacionRepository.existsById(id)) {
			throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
		}

		Optional<OperacionDTO> result = operacionService.partialUpdate(operacionDTO);

		return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true,
				ENTITY_NAME, operacionDTO.getId().toString()));
	}

	/**
	 * {@code GET  /operacions} : get all the operacions.
	 *
	 * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
	 *         of operacions in body.
	 */
	@GetMapping("/operacions")
	public List<OperacionDTO> getAllOperacions() {
		log.debug("REST request to get all Operacions");
		return operacionService.findAll();
	}

	/**
	 * {@code GET  /operacions/:id} : get the "id" operacion.
	 *
	 * @param id the id of the operacionDTO to retrieve.
	 * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
	 *         the operacionDTO, or with status {@code 404 (Not Found)}.
	 */
	@GetMapping("/operacions/{id}")
	public ResponseEntity<OperacionDTO> getOperacion(@PathVariable Long id) {
		log.debug("REST request to get Operacion : {}", id);
		Optional<OperacionDTO> operacionDTO = operacionService.findOne(id);
		return ResponseUtil.wrapOrNotFound(operacionDTO);
	}

	/**
	 * {@code DELETE  /operacions/:id} : delete the "id" operacion.
	 *
	 * @param id the id of the operacionDTO to delete.
	 * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
	 */
	@DeleteMapping("/operacions/{id}")
	public ResponseEntity<Void> deleteOperacion(@PathVariable Long id) {
		log.debug("REST request to delete Operacion : {}", id);
		operacionService.delete(id);
		return ResponseEntity.noContent()
				.headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
				.build();
	}
}
