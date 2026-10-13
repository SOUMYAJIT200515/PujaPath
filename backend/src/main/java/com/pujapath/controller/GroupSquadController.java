package com.pujapath.controller;

import com.pujapath.entity.GroupSquad;
import com.pujapath.service.GroupSquadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "*")
public class GroupSquadController {

    private final GroupSquadService groupSquadService;

    public GroupSquadController(GroupSquadService groupSquadService) {
        this.groupSquadService = groupSquadService;
    }

    public static class CreateGroupRequest {
        public String name;
        public String meetingPoint;
        public String emergencyContact;
    }

    public static class LocationUpdateRequest {
        public String userId;
        public double lat;
        public double lng;
        public double accuracy;
        public boolean isSharing;
    }

    @PostMapping
    public ResponseEntity<GroupSquad> createGroup(@RequestBody CreateGroupRequest req) {
        GroupSquad squad = groupSquadService.createGroup(req.name, req.meetingPoint, req.emergencyContact);
        return ResponseEntity.ok(squad);
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<GroupSquad> getGroupByCode(@PathVariable String code) {
        return groupSquadService.getGroupByCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupSquad> getGroupById(@PathVariable String id) {
        return groupSquadService.getGroupById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/location")
    public ResponseEntity<Void> updateLocation(@PathVariable String id,
                                               @RequestBody LocationUpdateRequest req) {
        groupSquadService.updateMemberLocation(id, req.userId, req.lat, req.lng, req.accuracy, req.isSharing);
        return ResponseEntity.ok().build();
    }
}
