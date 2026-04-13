package com.ryf.Proyecto_Ruta.Services;

import com.ryf.Proyecto_Ruta.Model.Cliente;
import com.ryf.Proyecto_Ruta.Model.Rol;
import com.ryf.Proyecto_Ruta.Model.User;
import com.ryf.Proyecto_Ruta.Repositories.ClienteRepository;
import com.ryf.Proyecto_Ruta.Repositories.UserRepository;
import com.ryf.Proyecto_Ruta.Repositories.RolRepository;
import org.springframework.stereotype.Service;

import com.ryf.Proyecto_Ruta.DTO.ClienteRequestDTO;
import com.ryf.Proyecto_Ruta.DTO.ClienteResponseDTO;
import com.ryf.Proyecto_Ruta.DTO.RegistroClienteDTO;
import com.ryf.Proyecto_Ruta.Mapper.ClienteMapper;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final UserRepository userRepository;
    private final ClienteMapper clienteMapper;
    private final PasswordEncoder passwordEncoder;
    private final RolRepository rolRepository;

    public ClienteService(ClienteRepository clienteRepository,
                          UserRepository userRepository,
                          ClienteMapper clienteMapper,
                          PasswordEncoder passwordEncoder,
                          RolRepository rolRepository ) {
        this.clienteRepository = clienteRepository;
        this.userRepository = userRepository;
        this.clienteMapper = clienteMapper;
        this.passwordEncoder = passwordEncoder;
        this.rolRepository = rolRepository;
    }

    //  CREAR PERFIL CLIENTE
    @Transactional // 👈 IMPORTANTE: Si algo falla, no se guarda nada
    public ClienteResponseDTO registrarClienteCompleto(RegistroClienteDTO dto) {
        
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("El email " + dto.getEmail() + " ya está en uso.");
        }

        // 1. Crear y Guardar el Usuario
        User nuevoUsuario = new User();
        nuevoUsuario.setEmail(dto.getEmail());
        nuevoUsuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        
        Rol rol = rolRepository.findById(dto.getRolId() != null ? dto.getRolId() : 2) // Por defecto rol 2 (Cliente)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        nuevoUsuario.setRol(rol);
        
        User usuarioGuardado = userRepository.save(nuevoUsuario);

        // 2. Crear y Guardar el Cliente vinculado a ese Usuario
        Cliente nuevoCliente = new Cliente();
        nuevoCliente.setDni(dto.getDni());
        nuevoCliente.setNombre(dto.getNombre());
        nuevoCliente.setApellido1(dto.getApellido1());
        nuevoCliente.setApellido2(dto.getApellido2());
        nuevoCliente.setTelefono(dto.getTelefono());
        nuevoCliente.setProvincia(dto.getProvincia());
        nuevoCliente.setLocalidad(dto.getLocalidad());
        
        //  Aquí hacemos la conexión usando el ID recién creado
        nuevoCliente.setUser(usuarioGuardado); 

        Cliente clienteGuardado = clienteRepository.save(nuevoCliente);

        return clienteMapper.toDTO(clienteGuardado);
    }


    public List<ClienteResponseDTO> listar() {
        return clienteRepository.findAll()
                .stream()
                .map(clienteMapper::toDTO)
                .toList();
    }

    public ClienteResponseDTO obtenerPorId(Integer id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        return clienteMapper.toDTO(cliente);
    }

    public ClienteResponseDTO obtenerPorUser(Integer userId) {
        Cliente cliente = clienteRepository.findByUserIdUser(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return clienteMapper.toDTO(cliente);
    }

    public ClienteResponseDTO actualizar(Integer id, ClienteRequestDTO ClienteDTO) {
    // 1. Buscamos el cliente existente en la DB
    Cliente cliente = clienteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

    // 2. ✅ ACTUALIZAMOS con los datos que vienen del DTO (Angular)
    cliente.setDni(ClienteDTO.getDni());
    cliente.setNombre(ClienteDTO.getNombre());
    cliente.setApellido1(ClienteDTO.getApellido1());
    cliente.setApellido2(ClienteDTO.getApellido2());
    cliente.setTelefono(ClienteDTO.getTelefono()); 
    cliente.setProvincia(ClienteDTO.getProvincia());
    cliente.setLocalidad(ClienteDTO.getLocalidad());
    // El email suele estar en el objeto User, si quieres actualizarlo 
    // asegúrate de que ClienteDTO lo traiga y el Mapper lo gestione.

     if(ClienteDTO.getPassword()!=null && !ClienteDTO.getPassword().isEmpty()){

        User user = cliente.getUser();
        user.setPassword(passwordEncoder.encode(ClienteDTO.getPassword()));
        userRepository.save(user);
    }

    // 3. Guardamos los cambios
    Cliente actualizado = clienteRepository.save(cliente);

    return clienteMapper.toDTO(actualizado);
}

    public void eliminar(Integer id) {
        if (!clienteRepository.existsById(id)) {
            throw new RuntimeException("Cliente no encontrado");
            
        }

        clienteRepository.deleteById(id);
    }
}
