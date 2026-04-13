package com.ryf.Proyecto_Ruta.Services;

import com.ryf.Proyecto_Ruta.Model.User;
import com.ryf.Proyecto_Ruta.Model.Rol;
import com.ryf.Proyecto_Ruta.Repositories.RolRepository;
import com.ryf.Proyecto_Ruta.Repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ryf.Proyecto_Ruta.DTO.UserRequestDTO;
import com.ryf.Proyecto_Ruta.DTO.UserResponseDTO;
import com.ryf.Proyecto_Ruta.Mapper.UserMapper;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository,
                       RolRepository rolRepository,
                       PasswordEncoder passwordEncoder,
                       UserMapper userMapper) {
        this.userRepository = userRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    public UserResponseDTO crearUser(UserRequestDTO UserDTO) {


        //  validar email
        if (userRepository.existsByEmail(UserDTO.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        //DTO a ENTITY
        User user = userMapper.toEntity(UserDTO);
        
        // 🔐 encriptar password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 🔐 asignar rol
        Rol rol = rolRepository.findById(UserDTO.getRolId())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        user.setRol(rol);

        User guardado = userRepository.save(user);

        //Entity a DTO
        return userMapper.toDTO(guardado);
    }

    public List<UserResponseDTO> listar() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDTO)
                .toList();
    }

    public UserResponseDTO obtenerPorId(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return userMapper.toDTO(user);
    }

    public void eliminar(Integer id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado");
            
        }

        userRepository.deleteById(id);
    }
}
