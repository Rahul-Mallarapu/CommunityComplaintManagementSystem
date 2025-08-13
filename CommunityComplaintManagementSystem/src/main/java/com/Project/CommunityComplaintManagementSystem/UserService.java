package com.Project.CommunityComplaintManagementSystem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService
{
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AuthenticationManager authManager;
    @Autowired
    private UserRepository repo;
    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
    public User register(User user)
    {
        if (repo.existsByUsername(user.getUsername()))
        {
            throw new RuntimeException("Username already exists!");
        }
        user.setPassword(encoder.encode(user.getPassword()));
        return repo.save(user);
    }
    public String verify(User user)
    {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );

        if (authentication.isAuthenticated())
        {
            return jwtService.generateToken(user.getUsername());
        }
        return "Fail";
    }
}