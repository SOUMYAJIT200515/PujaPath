package com.pujapath.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "group_members")
public class GroupMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "squad_id", nullable = false)
    @JsonIgnore
    private GroupSquad squad;

    @Column(nullable = false, length = 64)
    private String userId;

    @Column(nullable = false, length = 80)
    private String name;

    @Column(length = 10)
    private String avatar;

    @Column(nullable = false)
    private Boolean isSharingLocation = false;

    private Double lastLat;
    private Double lastLng;
    private Long lastLocationUpdate;
    private Double accuracy;

    public GroupMember() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public GroupSquad getSquad() { return squad; }
    public void setSquad(GroupSquad squad) { this.squad = squad; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public Boolean getIsSharingLocation() { return isSharingLocation; }
    public void setIsSharingLocation(Boolean isSharingLocation) { this.isSharingLocation = isSharingLocation; }

    public Double getLastLat() { return lastLat; }
    public void setLastLat(Double lastLat) { this.lastLat = lastLat; }

    public Double getLastLng() { return lastLng; }
    public void setLastLng(Double lastLng) { this.lastLng = lastLng; }

    public Long getLastLocationUpdate() { return lastLocationUpdate; }
    public void setLastLocationUpdate(Long lastLocationUpdate) { this.lastLocationUpdate = lastLocationUpdate; }

    public Double getAccuracy() { return accuracy; }
    public void setAccuracy(Double accuracy) { this.accuracy = accuracy; }
}
