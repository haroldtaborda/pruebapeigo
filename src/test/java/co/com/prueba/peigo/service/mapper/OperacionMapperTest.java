package co.com.prueba.peigo.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class OperacionMapperTest {

    private OperacionMapper operacionMapper;

    @BeforeEach
    public void setUp() {
        operacionMapper = new OperacionMapperImpl();
    }
}
