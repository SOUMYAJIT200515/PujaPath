package com.pujapath.repository;

import com.pujapath.entity.GroupSquad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GroupSquadRepository extends JpaRepository<GroupSquad, String> {

    Optional<GroupSquad> findByCode(String code);
}
