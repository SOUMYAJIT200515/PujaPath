package com.pujapath.service;

import com.pujapath.entity.GroupMember;
import com.pujapath.entity.GroupSquad;
import com.pujapath.repository.GroupSquadRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class GroupSquadService {

    private final GroupSquadRepository groupSquadRepository;

    public GroupSquadService(GroupSquadRepository groupSquadRepository) {
        this.groupSquadRepository = groupSquadRepository;
    }

    public Optional<GroupSquad> getGroupById(String id) {
        return groupSquadRepository.findById(id);
    }

    public Optional<GroupSquad> getGroupByCode(String code) {
        return groupSquadRepository.findByCode(code.toUpperCase());
    }

    public GroupSquad createGroup(String name, String meetingPoint, String emergencyContact) {
        GroupSquad squad = new GroupSquad();
        squad.setId("squad-" + UUID.randomUUID().toString().substring(0, 8));
        squad.setCode("PUJA-" + (int)(Math.random() * 900000 + 100000));
        squad.setName(name);
        squad.setMeetingPoint(meetingPoint);
        squad.setEmergencyContact(emergencyContact != null ? emergencyContact : "100 / 112");
        squad.setCreatedAt(System.currentTimeMillis());
        return groupSquadRepository.save(squad);
    }

    @Transactional
    public void updateMemberLocation(String squadId, String userId, double lat, double lng, double accuracy, boolean isSharing) {
        Optional<GroupSquad> squadOpt = groupSquadRepository.findById(squadId);
        if (squadOpt.isPresent()) {
            GroupSquad squad = squadOpt.get();
            for (GroupMember m : squad.getMembers()) {
                if (m.getUserId().equals(userId)) {
                    m.setIsSharingLocation(isSharing);
                    if (isSharing) {
                        m.setLastLat(lat);
                        m.setLastLng(lng);
                        m.setAccuracy(accuracy);
                        m.setLastLocationUpdate(System.currentTimeMillis());
                    }
                    break;
                }
            }
            groupSquadRepository.save(squad);
        }
    }
}
