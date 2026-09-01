package minhdat.dev.project.service;

import minhdat.dev.project.dto.ClassroomDto;
import minhdat.dev.project.entity.Classroom;
import minhdat.dev.project.repository.ClassroomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassroomService {

    private final ClassroomRepository classroomRepository;

    public ClassroomService(ClassroomRepository classroomRepository) {
        this.classroomRepository = classroomRepository;
    }

    public List<ClassroomDto> getAllClassrooms() {
        return classroomRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::mapToDto).toList();
    }

    public ClassroomDto getClassroomById(Long id) {
        Classroom classroom = classroomRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lớp học"));
        return mapToDto(classroom);
    }

    public ClassroomDto createClassroom(ClassroomDto dto) {
        if (classroomRepository.existsByClassCode(dto.getClassCode())) {
            throw new IllegalArgumentException("Mã lớp học đã tồn tại trong hệ thống");
        }

        Classroom classroom = new Classroom();
        classroom.setName(dto.getName());
        classroom.setClassCode(dto.getClassCode());
        classroom.setDescription(dto.getDescription());
        classroom.setTeacherName(dto.getTeacherName());
        classroom.setRoomNumber(dto.getRoomNumber());
        classroom.setSemester(dto.getSemester() != null ? dto.getSemester() : "HK1 - 2026");

        Classroom saved = classroomRepository.save(classroom);
        return mapToDto(saved);
    }

    public ClassroomDto updateClassroom(Long id, ClassroomDto dto) {
        Classroom classroom = classroomRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lớp học"));

        classroom.setName(dto.getName());
        classroom.setDescription(dto.getDescription());
        if (dto.getTeacherName() != null) classroom.setTeacherName(dto.getTeacherName());
        if (dto.getRoomNumber() != null) classroom.setRoomNumber(dto.getRoomNumber());
        if (dto.getSemester() != null) classroom.setSemester(dto.getSemester());

        Classroom updated = classroomRepository.save(classroom);
        return mapToDto(updated);
    }

    public void deleteClassroom(Long id) {
        Classroom classroom = classroomRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lớp học"));
        classroomRepository.delete(classroom);
    }

    public ClassroomDto mapToDto(Classroom classroom) {
        ClassroomDto dto = new ClassroomDto();
        dto.setId(classroom.getId());
        dto.setName(classroom.getName());
        dto.setClassCode(classroom.getClassCode());
        dto.setDescription(classroom.getDescription());
        dto.setTeacherName(classroom.getTeacherName());
        dto.setRoomNumber(classroom.getRoomNumber());
        dto.setSemester(classroom.getSemester());
        dto.setCreatedAt(classroom.getCreatedAt());
        return dto;
    }
}
