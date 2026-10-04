import React, { useEffect, useState } from "react";
import {
  X,
  UserRound,
  MapPin,
  Link as LinkIcon,
  BriefcaseBusiness,
  GraduationCap,
  FolderGit2,
  Plus,
  Trash2,
  Save,
  ChevronDown,
} from "lucide-react";

import { FaGithub, FaLinkedin } from "react-icons/fa";

const UpdateProfileModal = ({
  open,
  onClose,
  profile,
  onUpdate,
  loading = false,
}) => {
  const [form, setForm] = useState({
    headline: "",
    bio: "",

    location: {
      city: "",
      state: "",
      country: "India",
    },

    socialLinks: {
      github: "",
      linkedin: "",
      portfolio: "",
    },

    skills: [],

    experience: [],

    education: [],

    projects: [],

    preferences: {
      lookingForJob: true,
      preferredJobType: "full-time",
      workMode: "remote",

      expectedSalary: {
        min: "",
        max: "",
        currency: "INR",
      },
    },
  });

  /* --------------------------------
     LOAD EXISTING PROFILE
  -------------------------------- */

  useEffect(() => {
    if (!profile || !open) return;

    setForm({
      headline: profile.headline || "",

      bio: profile.bio || "",

      location: {
        city: profile.location?.city || "",
        state: profile.location?.state || "",
        country: profile.location?.country || "India",
      },

      socialLinks: {
        github: profile.socialLinks?.github || "",
        linkedin: profile.socialLinks?.linkedin || "",
        portfolio: profile.socialLinks?.portfolio || "",
      },

      skills: Array.isArray(profile.skills)
        ? profile.skills
        : [],

      experience: Array.isArray(profile.experience)
        ? profile.experience
        : [],

      education: Array.isArray(profile.education)
        ? profile.education
        : [],

      projects: Array.isArray(profile.projects)
        ? profile.projects
        : [],

      preferences: {
        lookingForJob:
          profile.preferences?.lookingForJob ?? true,

        preferredJobType:
          profile.preferences?.preferredJobType ||
          "full-time",

        workMode:
          profile.preferences?.workMode || "remote",

        expectedSalary: {
          min:
            profile.preferences?.expectedSalary?.min ?? "",

          max:
            profile.preferences?.expectedSalary?.max ?? "",

          currency:
            profile.preferences?.expectedSalary?.currency ||
            "INR",
        },
      },
    });
  }, [profile, open]);

  /* --------------------------------
     BASIC CHANGE
  -------------------------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* --------------------------------
     NESTED CHANGE
  -------------------------------- */

  const handleNestedChange = (
    section,
    field,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  /* --------------------------------
     SALARY CHANGE
  -------------------------------- */

  const handleSalaryChange = (
    field,
    value
  ) => {
    setForm((prev) => ({
      ...prev,

      preferences: {
        ...prev.preferences,

        expectedSalary: {
          ...prev.preferences.expectedSalary,

          [field]: value,
        },
      },
    }));
  };

  /* --------------------------------
     SKILLS
  -------------------------------- */

  const addSkill = () => {
    setForm((prev) => ({
      ...prev,

      skills: [
        ...prev.skills,

        {
          name: "",
          level: "intermediate",
        },
      ],
    }));
  };

  const updateSkill = (
    index,
    field,
    value
  ) => {
    setForm((prev) => ({
      ...prev,

      skills: prev.skills.map(
        (skill, i) =>
          i === index
            ? {
                ...skill,
                [field]: value,
              }
            : skill
      ),
    }));
  };

  const removeSkill = (index) => {
    setForm((prev) => ({
      ...prev,

      skills: prev.skills.filter(
        (_, i) => i !== index
      ),
    }));
  };

  /* --------------------------------
     EXPERIENCE
  -------------------------------- */

  const addExperience = () => {
    setForm((prev) => ({
      ...prev,

      experience: [
        ...prev.experience,

        {
          company: "",
          position: "",
          employmentType: "full-time",
          startDate: "",
          endDate: "",
          currentlyWorking: false,
          description: "",
        },
      ],
    }));
  };

  const updateExperience = (
    index,
    field,
    value
  ) => {
    setForm((prev) => ({
      ...prev,

      experience: prev.experience.map(
        (item, i) =>
          i === index
            ? {
                ...item,
                [field]: value,
              }
            : item
      ),
    }));
  };

  const removeExperience = (index) => {
    setForm((prev) => ({
      ...prev,

      experience:
        prev.experience.filter(
          (_, i) => i !== index
        ),
    }));
  };

  /* --------------------------------
     EDUCATION
  -------------------------------- */

  const addEducation = () => {
    setForm((prev) => ({
      ...prev,

      education: [
        ...prev.education,

        {
          institute: "",
          degree: "",
          field: "",
          startYear: "",
          endYear: "",
          grade: "",
        },
      ],
    }));
  };

  const updateEducation = (
    index,
    field,
    value
  ) => {
    setForm((prev) => ({
      ...prev,

      education: prev.education.map(
        (item, i) =>
          i === index
            ? {
                ...item,
                [field]: value,
              }
            : item
      ),
    }));
  };

  const removeEducation = (index) => {
    setForm((prev) => ({
      ...prev,

      education:
        prev.education.filter(
          (_, i) => i !== index
        ),
    }));
  };

  /* --------------------------------
     PROJECTS
  -------------------------------- */

  const addProject = () => {
    setForm((prev) => ({
      ...prev,

      projects: [
        ...prev.projects,

        {
          title: "",
          description: "",
          githubUrl: "",
          liveUrl: "",
          technologies: [],
          startDate: "",
          endDate: "",

          image: {
            url: "",
            public_id: "",
          },
        },
      ],
    }));
  };

  const updateProject = (
    index,
    field,
    value
  ) => {
    setForm((prev) => ({
      ...prev,

      projects: prev.projects.map(
        (item, i) =>
          i === index
            ? {
                ...item,
                [field]: value,
              }
            : item
      ),
    }));
  };

  const updateProjectTechnologies = (
    index,
    value
  ) => {
    const technologies = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    setForm((prev) => ({
      ...prev,

      projects: prev.projects.map(
        (item, i) =>
          i === index
            ? {
                ...item,
                technologies,
              }
            : item
      ),
    }));
  };

  const removeProject = (index) => {
    setForm((prev) => ({
      ...prev,

      projects:
        prev.projects.filter(
          (_, i) => i !== index
        ),
    }));
  };

  /* --------------------------------
     SUBMIT
  -------------------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!onUpdate) return;

    await onUpdate(form);
  };

  /* --------------------------------
     MODAL
  -------------------------------- */

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

      <div className="flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* ================= HEADER ================= */}

        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <UserRound className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Update Profile
              </h2>

              <p className="text-sm text-slate-500">
                Keep your professional profile up to date
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* ================= FORM ================= */}

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto"
        >

          <div className="space-y-8 p-6">

            {/* ================= BASIC INFO ================= */}

            <section>

              <SectionTitle
                icon={<UserRound />}
                title="Basic Information"
                description="Tell recruiters who you are"
              />

              <div className="mt-5 grid gap-5">

                <Input
                  label="Professional Headline"
                  name="headline"
                  value={form.headline}
                  onChange={handleChange}
                  placeholder="Software Developer | Full Stack Developer"
                />

                <div>
                  <label className={labelClass}>
                    About You
                  </label>

                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Write a short professional introduction..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

              </div>

            </section>

            {/* ================= LOCATION ================= */}

            <section>

              <SectionTitle
                icon={<MapPin />}
                title="Location"
                description="Where are you currently located?"
              />

              <div className="mt-5 grid gap-4 md:grid-cols-3">

                <Input
                  label="City"
                  value={form.location.city}
                  onChange={(e) =>
                    handleNestedChange(
                      "location",
                      "city",
                      e.target.value
                    )
                  }
                  placeholder="Agra"
                />

                <Input
                  label="State"
                  value={form.location.state}
                  onChange={(e) =>
                    handleNestedChange(
                      "location",
                      "state",
                      e.target.value
                    )
                  }
                  placeholder="Uttar Pradesh"
                />

                <Input
                  label="Country"
                  value={form.location.country}
                  onChange={(e) =>
                    handleNestedChange(
                      "location",
                      "country",
                      e.target.value
                    )
                  }
                  placeholder="India"
                />

              </div>

            </section>

            {/* ================= SOCIAL LINKS ================= */}

            <section>

              <SectionTitle
                icon={<LinkIcon />}
                title="Social Links"
                description="Add your professional online presence"
              />

              <div className="mt-5 grid gap-5 md:grid-cols-3">

                <IconInput
                  icon={
                    <FaGithub className="h-4 w-4" />
                  }
                  label="GitHub"
                  value={
                    form.socialLinks.github
                  }
                  placeholder="https://github.com/username"
                  onChange={(e) =>
                    handleNestedChange(
                      "socialLinks",
                      "github",
                      e.target.value
                    )
                  }
                />

                <IconInput
                  icon={
                    <FaLinkedin className="h-4 w-4" />
                  }
                  label="LinkedIn"
                  value={
                    form.socialLinks.linkedin
                  }
                  placeholder="https://linkedin.com/in/username"
                  onChange={(e) =>
                    handleNestedChange(
                      "socialLinks",
                      "linkedin",
                      e.target.value
                    )
                  }
                />

                <IconInput
                  icon={
                    <LinkIcon className="h-4 w-4" />
                  }
                  label="Portfolio"
                  value={
                    form.socialLinks.portfolio
                  }
                  placeholder="https://yourportfolio.com"
                  onChange={(e) =>
                    handleNestedChange(
                      "socialLinks",
                      "portfolio",
                      e.target.value
                    )
                  }
                />

              </div>

            </section>

            {/* ================= SKILLS ================= */}

            <section>

              <SectionHeader
                icon={<BriefcaseBusiness />}
                title="Skills"
                buttonText="Add Skill"
                onClick={addSkill}
              />

              <div className="mt-5 space-y-3">

                {form.skills.length === 0 ? (
                  <EmptySection text="No skills added yet." />
                ) : (
                  form.skills.map(
                    (skill, index) => (
                      <div
                        key={index}
                        className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_220px_auto]"
                      >

                        <Input
                          label="Skill"
                          value={
                            skill.name || ""
                          }
                          onChange={(e) =>
                            updateSkill(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="React.js"
                        />

                        <Select
                          label="Level"
                          value={
                            skill.level ||
                            "intermediate"
                          }
                          onChange={(e) =>
                            updateSkill(
                              index,
                              "level",
                              e.target.value
                            )
                          }
                          options={[
                            {
                              value: "beginner",
                              label: "Beginner",
                            },
                            {
                              value: "intermediate",
                              label:
                                "Intermediate",
                            },
                            {
                              value: "advanced",
                              label: "Advanced",
                            },
                            {
                              value: "expert",
                              label: "Expert",
                            },
                          ]}
                        />

                        <DeleteButton
                          onClick={() =>
                            removeSkill(index)
                          }
                        />

                      </div>
                    )
                  )
                )}

              </div>

            </section>

            {/* ================= EXPERIENCE ================= */}

            <section>

              <SectionHeader
                icon={<BriefcaseBusiness />}
                title="Experience"
                buttonText="Add Experience"
                onClick={addExperience}
              />

              <div className="mt-5 space-y-5">

                {form.experience.length === 0 ? (
                  <EmptySection text="No experience added yet." />
                ) : (
                  form.experience.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                      >

                        <div className="mb-5 flex items-center justify-between">

                          <h4 className="font-semibold text-slate-900">
                            Experience #{index + 1}
                          </h4>

                          <DeleteButton
                            onClick={() =>
                              removeExperience(
                                index
                              )
                            }
                          />

                        </div>

                        <div className="grid gap-4 md:grid-cols-2">

                          <Input
                            label="Company"
                            value={
                              item.company || ""
                            }
                            onChange={(e) =>
                              updateExperience(
                                index,
                                "company",
                                e.target.value
                              )
                            }
                            placeholder="Company name"
                          />

                          <Input
                            label="Position"
                            value={
                              item.position || ""
                            }
                            onChange={(e) =>
                              updateExperience(
                                index,
                                "position",
                                e.target.value
                              )
                            }
                            placeholder="Software Developer"
                          />

                          <Select
                            label="Employment Type"
                            value={
                              item.employmentType ||
                              "full-time"
                            }
                            onChange={(e) =>
                              updateExperience(
                                index,
                                "employmentType",
                                e.target.value
                              )
                            }
                            options={[
                              {
                                value: "full-time",
                                label: "Full-time",
                              },
                              {
                                value: "part-time",
                                label: "Part-time",
                              },
                              {
                                value: "internship",
                                label: "Internship",
                              },
                              {
                                value: "freelance",
                                label: "Freelance",
                              },
                              {
                                value: "contract",
                                label: "Contract",
                              },
                            ]}
                          />

                          <Input
                            label="Start Date"
                            type="date"
                            value={
                              item.startDate
                                ? String(
                                    item.startDate
                                  ).slice(
                                    0,
                                    10
                                  )
                                : ""
                            }
                            onChange={(e) =>
                              updateExperience(
                                index,
                                "startDate",
                                e.target.value
                              )
                            }
                          />

                          {!item.currentlyWorking && (
                            <Input
                              label="End Date"
                              type="date"
                              value={
                                item.endDate
                                  ? String(
                                      item.endDate
                                    ).slice(
                                      0,
                                      10
                                    )
                                  : ""
                              }
                              onChange={(e) =>
                                updateExperience(
                                  index,
                                  "endDate",
                                  e.target.value
                                )
                              }
                            />
                          )}

                        </div>

                        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">

                          <input
                            type="checkbox"
                            checked={
                              Boolean(
                                item.currentlyWorking
                              )
                            }
                            onChange={(e) =>
                              updateExperience(
                                index,
                                "currentlyWorking",
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                          />

                          I currently work here

                        </label>

                        <div className="mt-4">

                          <label className={labelClass}>
                            Description
                          </label>

                          <textarea
                            rows={4}
                            value={
                              item.description ||
                              ""
                            }
                            onChange={(e) =>
                              updateExperience(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="Describe your responsibilities and achievements..."
                            className={`${inputClass} resize-none`}
                          />

                        </div>

                      </div>
                    )
                  )
                )}

              </div>

            </section>

            {/* ================= EDUCATION ================= */}

            <section>

              <SectionHeader
                icon={<GraduationCap />}
                title="Education"
                buttonText="Add Education"
                onClick={addEducation}
              />

              <div className="mt-5 space-y-5">

                {form.education.length === 0 ? (
                  <EmptySection text="No education added yet." />
                ) : (
                  form.education.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                      >

                        <div className="mb-5 flex items-center justify-between">

                          <h4 className="font-semibold text-slate-900">
                            Education #{index + 1}
                          </h4>

                          <DeleteButton
                            onClick={() =>
                              removeEducation(
                                index
                              )
                            }
                          />

                        </div>

                        <div className="grid gap-4 md:grid-cols-2">

                          <Input
                            label="Institute"
                            value={
                              item.institute ||
                              ""
                            }
                            onChange={(e) =>
                              updateEducation(
                                index,
                                "institute",
                                e.target.value
                              )
                            }
                            placeholder="University / College"
                          />

                          <Input
                            label="Degree"
                            value={
                              item.degree || ""
                            }
                            onChange={(e) =>
                              updateEducation(
                                index,
                                "degree",
                                e.target.value
                              )
                            }
                            placeholder="BCA"
                          />

                          <Input
                            label="Field of Study"
                            value={
                              item.field || ""
                            }
                            onChange={(e) =>
                              updateEducation(
                                index,
                                "field",
                                e.target.value
                              )
                            }
                            placeholder="Computer Science"
                          />

                          <Input
                            label="Grade / CGPA"
                            value={
                              item.grade || ""
                            }
                            onChange={(e) =>
                              updateEducation(
                                index,
                                "grade",
                                e.target.value
                              )
                            }
                            placeholder="8.2 CGPA"
                          />

                          <Input
                            label="Start Year"
                            type="number"
                            value={
                              item.startYear ??
                              ""
                            }
                            onChange={(e) =>
                              updateEducation(
                                index,
                                "startYear",
                                e.target.value
                                  ? Number(
                                      e.target.value
                                    )
                                  : ""
                              )
                            }
                            placeholder="2024"
                          />

                          <Input
                            label="End Year"
                            type="number"
                            value={
                              item.endYear ??
                              ""
                            }
                            onChange={(e) =>
                              updateEducation(
                                index,
                                "endYear",
                                e.target.value
                                  ? Number(
                                      e.target.value
                                    )
                                  : ""
                              )
                            }
                            placeholder="2027"
                          />

                        </div>

                      </div>
                    )
                  )
                )}

              </div>

            </section>

            {/* ================= PROJECTS ================= */}

            <section>

              <SectionHeader
                icon={<FolderGit2 />}
                title="Projects"
                buttonText="Add Project"
                onClick={addProject}
              />

              <div className="mt-5 space-y-5">

                {form.projects.length === 0 ? (
                  <EmptySection text="No projects added yet." />
                ) : (
                  form.projects.map(
                    (project, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                      >

                        <div className="mb-5 flex items-center justify-between">

                          <h4 className="font-semibold text-slate-900">
                            Project #{index + 1}
                          </h4>

                          <DeleteButton
                            onClick={() =>
                              removeProject(
                                index
                              )
                            }
                          />

                        </div>

                        <div className="grid gap-4">

                          <Input
                            label="Project Title"
                            value={
                              project.title ||
                              ""
                            }
                            onChange={(e) =>
                              updateProject(
                                index,
                                "title",
                                e.target.value
                              )
                            }
                            placeholder="Peer.Hiring"
                          />

                          <div>
                            <label className={labelClass}>
                              Description
                            </label>

                            <textarea
                              rows={4}
                              value={
                                project.description ||
                                ""
                              }
                              onChange={(e) =>
                                updateProject(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Describe your project..."
                              className={`${inputClass} resize-none`}
                            />
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">

                            <Input
                              label="GitHub URL"
                              type="url"
                              value={
                                project.githubUrl ||
                                ""
                              }
                              onChange={(e) =>
                                updateProject(
                                  index,
                                  "githubUrl",
                                  e.target.value
                                )
                              }
                              placeholder="https://github.com/..."
                            />

                            <Input
                              label="Live URL"
                              type="url"
                              value={
                                project.liveUrl ||
                                ""
                              }
                              onChange={(e) =>
                                updateProject(
                                  index,
                                  "liveUrl",
                                  e.target.value
                                )
                              }
                              placeholder="https://..."
                            />

                          </div>

                          <Input
                            label="Technologies"
                            value={
                              Array.isArray(
                                project.technologies
                              )
                                ? project.technologies.join(
                                    ", "
                                  )
                                : ""
                            }
                            onChange={(e) =>
                              updateProjectTechnologies(
                                index,
                                e.target.value
                              )
                            }
                            placeholder="React, Node.js, MongoDB"
                          />

                          <div className="grid gap-4 md:grid-cols-2">

                            <Input
                              label="Start Date"
                              type="date"
                              value={
                                project.startDate
                                  ? String(
                                      project.startDate
                                    ).slice(
                                      0,
                                      10
                                    )
                                  : ""
                              }
                              onChange={(e) =>
                                updateProject(
                                  index,
                                  "startDate",
                                  e.target.value
                                )
                              }
                            />

                            <Input
                              label="End Date"
                              type="date"
                              value={
                                project.endDate
                                  ? String(
                                      project.endDate
                                    ).slice(
                                      0,
                                      10
                                    )
                                  : ""
                              }
                              onChange={(e) =>
                                updateProject(
                                  index,
                                  "endDate",
                                  e.target.value
                                )
                              }
                            />

                          </div>

                        </div>

                      </div>
                    )
                  )
                )}

              </div>

            </section>

            {/* ================= JOB PREFERENCES ================= */}

            <section>

              <SectionTitle
                icon={<BriefcaseBusiness />}
                title="Job Preferences"
                description="Help recruiters understand what you're looking for"
              />

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">

                {/* Looking for job */}

                <div className="flex items-center justify-between gap-4">

                  <div>
                    <p className="font-semibold text-slate-900">
                      Looking for opportunities
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Let recruiters know you're open to opportunities.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,

                        preferences: {
                          ...prev.preferences,

                          lookingForJob:
                            !prev.preferences
                              .lookingForJob,
                        },
                      }))
                    }
                    className={`relative h-7 w-12 rounded-full transition ${
                      form.preferences
                        .lookingForJob
                        ? "bg-violet-600"
                        : "bg-slate-300"
                    }`}
                  >

                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                        form.preferences
                          .lookingForJob
                          ? "left-6"
                          : "left-1"
                      }`}
                    />

                  </button>

                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">

                  <Select
                    label="Preferred Job Type"
                    value={
                      form.preferences
                        .preferredJobType
                    }
                    onChange={(e) =>
                      handleNestedChange(
                        "preferences",
                        "preferredJobType",
                        e.target.value
                      )
                    }
                    options={[
                      {
                        value: "full-time",
                        label: "Full-time",
                      },
                      {
                        value: "part-time",
                        label: "Part-time",
                      },
                      {
                        value: "internship",
                        label: "Internship",
                      },
                      {
                        value: "contract",
                        label: "Contract",
                      },
                      {
                        value: "freelance",
                        label: "Freelance",
                      },
                    ]}
                  />

                  <Select
                    label="Work Mode"
                    value={
                      form.preferences.workMode
                    }
                    onChange={(e) =>
                      handleNestedChange(
                        "preferences",
                        "workMode",
                        e.target.value
                      )
                    }
                    options={[
                      {
                        value: "remote",
                        label: "Remote",
                      },
                      {
                        value: "hybrid",
                        label: "Hybrid",
                      },
                      {
                        value: "onsite",
                        label: "On-site",
                      },
                    ]}
                  />

                </div>

                {/* Salary */}

                <div className="mt-5">

                  <label className={labelClass}>
                    Expected Salary
                  </label>

                  <div className="grid gap-3 md:grid-cols-3">

                    <Input
                      type="number"
                      value={
                        form.preferences
                          .expectedSalary
                          .min
                      }
                      onChange={(e) =>
                        handleSalaryChange(
                          "min",
                          e.target.value
                        )
                      }
                      placeholder="Minimum"
                    />

                    <Input
                      type="number"
                      value={
                        form.preferences
                          .expectedSalary
                          .max
                      }
                      onChange={(e) =>
                        handleSalaryChange(
                          "max",
                          e.target.value
                        )
                      }
                      placeholder="Maximum"
                    />

                    <Select
                      value={
                        form.preferences
                          .expectedSalary
                          .currency
                      }
                      onChange={(e) =>
                        handleSalaryChange(
                          "currency",
                          e.target.value
                        )
                      }
                      options={[
                        {
                          value: "INR",
                          label: "INR ₹",
                        },
                        {
                          value: "USD",
                          label: "USD $",
                        },
                      ]}
                    />

                  </div>

                </div>

              </div>

            </section>

          </div>

          {/* ================= FOOTER ================= */}

          <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              <Save className="h-4 w-4" />

              {loading
                ? "Saving..."
                : "Save Changes"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

/* =====================================================
   SMALL COMPONENTS
===================================================== */

function SectionTitle({
  icon,
  title,
  description,
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">

        {React.cloneElement(icon, {
          className: "h-5 w-5",
        })}

      </div>

      <div>
        <h3 className="font-bold text-slate-900">
          {title}
        </h3>

        <p className="mt-0.5 text-sm text-slate-500">
          {description}
        </p>
      </div>

    </div>
  );
}

function SectionHeader({
  icon,
  title,
  buttonText,
  onClick,
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">

          {React.cloneElement(icon, {
            className: "h-5 w-5",
          })}

        </div>

        <h3 className="font-bold text-slate-900">
          {title}
        </h3>

      </div>

      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3.5 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
      >
        <Plus className="h-4 w-4" />
        {buttonText}
      </button>

    </div>
  );
}

function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
}) {
  return (
    <div>

      {label && (
        <label className={labelClass}>
          {label}
        </label>
      )}

      <input
        type={type}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`${inputClass} ${
          disabled
            ? "cursor-not-allowed bg-slate-100"
            : ""
        }`}
      />

    </div>
  );
}

function IconInput({
  icon,
  label,
  value,
  placeholder,
  onChange,
}) {
  return (
    <div>

      <label className={labelClass}>
        {label}
      </label>

      <div className="relative">

        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>

        <input
          type="url"
          value={value || ""}
          placeholder={placeholder}
          onChange={onChange}
          className={`${inputClass} pl-10`}
        />

      </div>

    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div>

      {label && (
        <label className={labelClass}>
          {label}
        </label>
      )}

      <div className="relative">

        <select
          value={value ?? ""}
          onChange={onChange}
          className={`${inputClass} appearance-none pr-10`}
        >

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}

        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

      </div>

    </div>
  );
}

function DeleteButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 hover:text-red-600"
      title="Remove"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

function EmptySection({ text }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10";

const labelClass =
  "mb-2 block text-sm font-semibold text-slate-700";

export default UpdateProfileModal;