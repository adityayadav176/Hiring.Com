import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  UserRound,
  Code2,
  BriefcaseBusiness,
  GraduationCap,
  FolderGit2,
  Link2,
  FileText,
  MapPin,
  Target,
  Plus,
  Trash2,
  ChevronRight,
  Check,
  Upload,
  Globe,
} from "lucide-react";

import {
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

import { useProfile } from "../../hooks/Hook";

/* =========================================================
   CONSTANTS
========================================================= */

const sections = [
  {
    id: "about",
    label: "About",
    icon: UserRound,
  },
  {
    id: "skills",
    label: "Skills",
    icon: Code2,
  },
  {
    id: "experience",
    label: "Experience",
    icon: BriefcaseBusiness,
  },
  {
    id: "education",
    label: "Education",
    icon: GraduationCap,
  },
  {
    id: "projects",
    label: "Projects",
    icon: FolderGit2,
  },
  {
    id: "links",
    label: "Links",
    icon: Link2,
  },
  {
    id: "resume",
    label: "Resume",
    icon: FileText,
  },
  {
    id: "preferences",
    label: "Preferences",
    icon: Target,
  },
];

const jobTypes = [
  "Full Time",
  "Part Time",
  "Contract",
  "Internship",
  "Freelance",
  "remote",
  "hybrid",
  "onsite",
];

const employmentTypes = [
  "internship",
  "full-time",
  "part-time",
  "contract",
];

const skillLevels = [
  "beginner",
  "intermediate",
  "expert",
];

/* =========================================================
   EMPTY FORM
========================================================= */

const getEmptyForm = () => ({
  headline: "",
  bio: "",

  location: {
    city: "",
    state: "",
    country: "India",
  },

  skills: [],

  experience: [],

  education: [],

  projects: [],

  socialLinks: {
    github: "",
    linkedin: "",
    portfolio: "",
  },

  resumeId: "",

  preferences: {
    lookingForJob: true,

    expectedSalary: {
      min: "",
      max: "",
      currency: "INR",
    },

    preferredJobType: [],
  },
});

/* =========================================================
   HELPERS
========================================================= */

const formatDateForInput = (date) => {
  if (!date) return "";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return value.toISOString().split("T")[0];
};

const normalizeSkill = (skill = {}) => ({
  name: skill.name || "",
  level: skill.level || "intermediate",
});

const normalizeExperience = (item = {}) => ({
  company: item.company || "",
  position: item.position || "",

  employmentType:
    typeof item.employmentType === "object"
      ? item.employmentType?.type ||
        "full-time"
      : item.employmentType ||
        "full-time",

  startDate: formatDateForInput(
    item.startDate
  ),

  endDate: formatDateForInput(
    item.endDate
  ),

  currentlyWorking:
    item.currentlyWorking ?? false,

  description:
    item.description || "",
});

const normalizeEducation = (
  item = {}
) => ({
  institute:
    item.institute || "",

  degree:
    item.degree || "",

  field:
    item.field || "",

  startYear:
    item.startYear != null
      ? String(item.startYear)
      : "",

  endYear:
    item.endYear != null
      ? String(item.endYear)
      : "",

  grade:
    item.grade || "",
});

const normalizeProject = (
  project = {}
) => ({
  title:
    project.title || "",

  description:
    project.description || "",

  githubUrl:
    project.githubUrl || "",

  liveUrl:
    project.liveUrl || "",

  image: {
    url:
      project.image?.url || "",

    public_id:
      project.image?.public_id || "",
  },

  technologies:
    Array.isArray(
      project.technologies
    )
      ? project.technologies
      : [],

  startDate:
    formatDateForInput(
      project.startDate
    ),

  endDate:
    formatDateForInput(
      project.endDate
    ),
});

/* =========================================================
   MAIN COMPONENT
========================================================= */

function CreateProfile1({
  profile,
  onSave,
}) {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] =
    useState("about");

  const [formData, setFormData] =
    useState(getEmptyForm);

  const [saving, setSaving] =
    useState(false);

  /* =======================================================
     LOAD EXISTING PROFILE
  ======================================================= */

  useEffect(() => {
    if (!profile) {
      setFormData(getEmptyForm());
      setActiveSection("about");
      return;
    }

    setFormData({
      headline:
        profile.headline || "",

      bio:
        profile.bio || "",

      location: {
        city:
          profile.location?.city || "",

        state:
          profile.location?.state || "",

        country:
          profile.location?.country ||
          "India",
      },

      skills:
        Array.isArray(profile.skills)
          ? profile.skills.map(
              normalizeSkill
            )
          : [],

      experience:
        Array.isArray(
          profile.experience
        )
          ? profile.experience.map(
              normalizeExperience
            )
          : [],

      education:
        Array.isArray(
          profile.education
        )
          ? profile.education.map(
              normalizeEducation
            )
          : [],

      projects:
        Array.isArray(
          profile.projects
        )
          ? profile.projects.map(
              normalizeProject
            )
          : [],

      socialLinks: {
        github:
          profile.socialLinks?.github ||
          "",

        linkedin:
          profile.socialLinks?.linkedin ||
          "",

        portfolio:
          profile.socialLinks?.portfolio ||
          "",
      },

      resumeId:
        profile.resumeId?._id ||
        profile.resumeId ||
        "",

      preferences: {
        lookingForJob:
          profile.preferences
            ?.lookingForJob ?? true,

        expectedSalary: {
          min:
            profile.preferences
              ?.expectedSalary?.min ??
            "",

          max:
            profile.preferences
              ?.expectedSalary?.max ??
            "",

          currency:
            profile.preferences
              ?.expectedSalary
              ?.currency ||
            "INR",
        },

        preferredJobType:
          Array.isArray(
            profile.preferences
              ?.preferredJobType
          )
            ? profile.preferences
                .preferredJobType
            : [],
      },
    });

    setActiveSection("about");
  }, [profile]);

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const handleBack = () => {
    if (saving) return;

    navigate("/profile");
  };

  /* =======================================================
     FIELD HELPERS
  ======================================================= */

  const updateField = (
    field,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateNestedField = (
    parent,
    field,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,

      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  /* =======================================================
     SKILLS
  ======================================================= */

  const addSkill = () => {
    setFormData((prev) => ({
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
    setFormData((prev) => ({
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
    setFormData((prev) => ({
      ...prev,

      skills: prev.skills.filter(
        (_, i) => i !== index
      ),
    }));
  };

  /* =======================================================
     EXPERIENCE
  ======================================================= */

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,

      experience: [
        ...prev.experience,

        {
          company: "",
          position: "",
          employmentType:
            "full-time",
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
    setFormData((prev) => ({
      ...prev,

      experience:
        prev.experience.map(
          (item, i) =>
            i === index
              ? {
                  ...item,

                  [field]: value,

                  ...(field ===
                    "currentlyWorking" &&
                  value
                    ? {
                        endDate: "",
                      }
                    : {}),
                }
              : item
        ),
    }));
  };

  const removeExperience = (
    index
  ) => {
    setFormData((prev) => ({
      ...prev,

      experience:
        prev.experience.filter(
          (_, i) => i !== index
        ),
    }));
  };

  /* =======================================================
     EDUCATION
  ======================================================= */

  const addEducation = () => {
    setFormData((prev) => ({
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
    setFormData((prev) => ({
      ...prev,

      education:
        prev.education.map(
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

  const removeEducation = (
    index
  ) => {
    setFormData((prev) => ({
      ...prev,

      education:
        prev.education.filter(
          (_, i) => i !== index
        ),
    }));
  };

  /* =======================================================
     PROJECTS
  ======================================================= */

  const addProject = () => {
    setFormData((prev) => ({
      ...prev,

      projects: [
        ...prev.projects,

        {
          title: "",
          description: "",
          githubUrl: "",
          liveUrl: "",

          image: {
            url: "",
            public_id: "",
          },

          technologies: [],

          startDate: "",
          endDate: "",
        },
      ],
    }));
  };

  const updateProject = (
    index,
    field,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,

      projects:
        prev.projects.map(
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

  const removeProject = (
    index
  ) => {
    setFormData((prev) => ({
      ...prev,

      projects:
        prev.projects.filter(
          (_, i) => i !== index
        ),
    }));
  };

  /* =======================================================
     JOB TYPE
  ======================================================= */

  const toggleJobType = (
    type
  ) => {
    setFormData((prev) => {
      const current =
        prev.preferences
          .preferredJobType || [];

      const selected =
        current.includes(type);

      const next = selected
        ? current.filter(
            (item) =>
              item !== type
          )
        : [...current, type];

      return {
        ...prev,

        preferences: {
          ...prev.preferences,

          preferredJobType:
            next,
        },
      };
    });
  };

  /* =======================================================
     COMPLETION
  ======================================================= */

  const completion = (() => {
    const checks = [
      Boolean(
        formData.headline.trim()
      ),

      Boolean(
        formData.bio.trim()
      ),

      Boolean(
        formData.location.city.trim() ||
          formData.location.state.trim()
      ),

      formData.skills.length > 0,

      formData.experience.length > 0,

      formData.education.length > 0,

      formData.projects.length > 0,

      Boolean(
        formData.socialLinks.github.trim() ||
          formData.socialLinks.linkedin.trim() ||
          formData.socialLinks.portfolio.trim()
      ),
    ];

    const completed =
      checks.filter(Boolean).length;

    return Math.round(
      (completed / checks.length) *
        100
    );
  })();

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (
      typeof onSave !== "function"
    ) {
      console.error(
        "CreateProfile1: onSave is not provided."
      );

      return;
    }

    if (
      !formData.headline.trim()
    ) {
      setActiveSection("about");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        headline:
          formData.headline.trim(),

        bio:
          formData.bio.trim(),

        location: {
          city:
            formData.location.city.trim(),

          state:
            formData.location.state.trim(),

          country:
            formData.location.country.trim() ||
            "India",
        },

        skills:
          formData.skills
            .filter(
              (skill) =>
                skill.name.trim()
            )
            .map((skill) => ({
              name:
                skill.name.trim(),

              level:
                skill.level ||
                "intermediate",
            })),

        experience:
          formData.experience.map(
            (item) => ({
              company:
                item.company.trim(),

              position:
                item.position.trim(),

              employmentType:
                item.employmentType,

              startDate:
                item.startDate ||
                undefined,

              endDate:
                item.currentlyWorking
                  ? undefined
                  : item.endDate ||
                    undefined,

              currentlyWorking:
                Boolean(
                  item.currentlyWorking
                ),

              description:
                item.description.trim(),
            })
          ),

        education:
          formData.education.map(
            (item) => ({
              institute:
                item.institute.trim(),

              degree:
                item.degree.trim(),

              field:
                item.field.trim(),

              startYear:
                item.startYear
                  ? Number(
                      item.startYear
                    )
                  : undefined,

              endYear:
                item.endYear
                  ? Number(
                      item.endYear
                    )
                  : undefined,

              grade:
                item.grade.trim(),
            })
          ),

        projects:
          formData.projects.map(
            (project) => ({
              title:
                project.title.trim(),

              description:
                project.description.trim(),

              githubUrl:
                project.githubUrl.trim(),

              liveUrl:
                project.liveUrl.trim(),

              image:
                project.image,

              technologies:
                project.technologies
                  .map((item) =>
                    item.trim()
                  )
                  .filter(Boolean),

              startDate:
                project.startDate ||
                undefined,

              endDate:
                project.endDate ||
                undefined,
            })
          ),

        socialLinks: {
          github:
            formData.socialLinks.github.trim(),

          linkedin:
            formData.socialLinks.linkedin.trim(),

          portfolio:
            formData.socialLinks.portfolio.trim(),
        },

        resumeId:
          formData.resumeId || undefined,

        preferences: {
          lookingForJob:
            formData.preferences
              .lookingForJob,

          expectedSalary: {
            min:
              formData.preferences
                .expectedSalary.min
                ? Number(
                    formData.preferences
                      .expectedSalary
                      .min
                  )
                : undefined,

            max:
              formData.preferences
                .expectedSalary.max
                ? Number(
                    formData.preferences
                      .expectedSalary
                      .max
                  )
                : undefined,

            currency:
              formData.preferences
                .expectedSalary
                .currency ||
              "INR",
          },

          preferredJobType:
            formData.preferences
              .preferredJobType,
        },
      };

      await onSave(payload);

      navigate("/profile");
    } catch (error) {
      console.error(
        "Profile save failed:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="h-screen w-full overflow-hidden bg-[#F8F9FC]">

      <div className="flex h-full w-full">

        {/* SIDEBAR */}

        <aside className="hidden h-full w-[250px] shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">

          <div className="border-b border-slate-100 px-6 py-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm shadow-violet-200">
                <UserRound size={18} />
              </div>

              <div>

                <p className="text-sm font-semibold text-slate-900">
                  {profile
                    ? "Edit Profile"
                    : "Create Profile"}
                </p>

                <p className="mt-0.5 text-[11px] text-slate-400">
                  Build your professional presence
                </p>

              </div>

            </div>

          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5">

            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Profile sections
            </p>

            <div className="space-y-1">

              {sections.map(
                (section) => {
                  const Icon =
                    section.icon;

                  const active =
                    activeSection ===
                    section.id;

                  return (
                    <button
                      key={
                        section.id
                      }
                      type="button"
                      onClick={() =>
                        setActiveSection(
                          section.id
                        )
                      }
                      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                        active
                          ? "bg-violet-50 text-violet-700"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                    >

                      <Icon
                        size={17}
                        className={
                          active
                            ? "text-violet-600"
                            : "text-slate-400"
                        }
                      />

                      <span className="flex-1 text-[13px] font-medium">
                        {
                          section.label
                        }
                      </span>

                      {active && (
                        <ChevronRight
                          size={14}
                          className="text-violet-500"
                        />
                      )}

                    </button>
                  );
                }
              )}

            </div>

          </div>

          <div className="border-t border-slate-100 p-5">

            <div className="rounded-2xl bg-[#F8F5FF] p-4">

              <div className="flex items-center justify-between">

                <p className="text-xs font-semibold text-slate-700">
                  Profile strength
                </p>

                <span className="text-xs font-bold text-violet-600">
                  {completion}%
                </span>

              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-violet-100">

                <div
                  className="h-full rounded-full bg-violet-600 transition-all duration-300"
                  style={{
                    width: `${completion}%`,
                  }}
                />

              </div>

              <p className="mt-2 text-[11px] leading-4 text-slate-500">
                Complete more sections to make your profile stronger.
              </p>

            </div>

          </div>

        </aside>

        {/* MAIN */}

        <main className="flex h-full min-w-0 flex-1 flex-col">

          <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-6 lg:px-8">

            <div className="min-w-0">

              <h2 className="truncate text-lg font-semibold text-slate-900">
                {profile
                  ? "Edit your profile"
                  : "Create your profile"}
              </h2>

              <p className="mt-0.5 hidden text-xs text-slate-400 sm:block">
                {profile
                  ? "Keep your professional information up to date."
                  : "Add your professional information to get started."}
              </p>

            </div>

            <button
              type="button"
              onClick={handleBack}
              disabled={saving}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Back to profile"
            >
              <ArrowLeft size={19} />
            </button>

          </header>

          {/* MOBILE NAV */}

          <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">

            <div className="flex gap-2 overflow-x-auto pb-1">

              {sections.map(
                (section) => {
                  const Icon =
                    section.icon;

                  const active =
                    activeSection ===
                    section.id;

                  return (
                    <button
                      key={
                        section.id
                      }
                      type="button"
                      onClick={() =>
                        setActiveSection(
                          section.id
                        )
                      }
                      className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                        active
                          ? "bg-violet-50 text-violet-700"
                          : "bg-slate-50 text-slate-500"
                      }`}
                    >

                      <Icon size={14} />

                      {section.label}

                    </button>
                  );
                }
              )}

            </div>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="min-h-0 flex-1 overflow-y-auto"
          >

            <div className="mx-auto max-w-[950px] px-5 py-7 sm:px-6 lg:px-10 lg:py-8">

              {/* ABOUT */}

              {activeSection ===
                "about" && (
                <section>

                  <SectionHeader
                    eyebrow="ABOUT"
                    title="Tell recruiters about yourself"
                    description="Start with the information that represents you professionally."
                  />

                  <div className="mt-8 space-y-6">

                    <Field
                      label="Professional headline"
                      required
                      hint="A short statement describing what you do."
                    >

                      <input
                        required
                        value={
                          formData.headline
                        }
                        onChange={(e) =>
                          updateField(
                            "headline",
                            e.target.value
                          )
                        }
                        placeholder="e.g. Full Stack Developer | React & Node.js"
                        className={
                          inputClass
                        }
                      />

                    </Field>

                    <Field
                      label="About"
                      hint="Maximum 500 characters."
                    >

                      <textarea
                        rows={7}
                        maxLength={500}
                        value={
                          formData.bio
                        }
                        onChange={(e) =>
                          updateField(
                            "bio",
                            e.target.value
                          )
                        }
                        placeholder="Tell recruiters about your experience, interests, strengths and what you're building..."
                        className={`${inputClass} h-auto resize-none py-3.5`}
                      />

                      <div className="mt-2 text-right text-[11px] text-slate-400">
                        {formData.bio.length}
                        /500
                      </div>

                    </Field>

                    <div>

                      <div className="mb-4 flex items-center gap-2">

                        <MapPin
                          size={17}
                          className="text-violet-600"
                        />

                        <h3 className="text-sm font-semibold text-slate-800">
                          Location
                        </h3>

                      </div>

                      <div className="grid gap-4 md:grid-cols-3">

                        <input
                          value={
                            formData
                              .location
                              .city
                          }
                          onChange={(e) =>
                            updateNestedField(
                              "location",
                              "city",
                              e.target.value
                            )
                          }
                          placeholder="City"
                          className={
                            inputClass
                          }
                        />

                        <input
                          value={
                            formData
                              .location
                              .state
                          }
                          onChange={(e) =>
                            updateNestedField(
                              "location",
                              "state",
                              e.target.value
                            )
                          }
                          placeholder="State"
                          className={
                            inputClass
                          }
                        />

                        <input
                          value={
                            formData
                              .location
                              .country
                          }
                          onChange={(e) =>
                            updateNestedField(
                              "location",
                              "country",
                              e.target.value
                            )
                          }
                          placeholder="Country"
                          className={
                            inputClass
                          }
                        />

                      </div>

                    </div>

                  </div>

                </section>
              )}

              {/* SKILLS */}

              {activeSection ===
                "skills" && (
                <section>

                  <SectionHeader
                    eyebrow="SKILLS"
                    title="Showcase your expertise"
                    description="Add technologies and skills with your current proficiency level."
                    action={
                      <AddButton
                        onClick={
                          addSkill
                        }
                        label="Add skill"
                      />
                    }
                  />

                  <div className="mt-8 space-y-3">

                    {formData.skills
                      .length === 0 ? (
                      <EmptySection
                        icon={Code2}
                        title="No skills added yet"
                        description="Add technologies and tools you work with."
                        action={
                          <AddButton
                            onClick={
                              addSkill
                            }
                            label="Add your first skill"
                          />
                        }
                      />
                    ) : (
                      formData.skills.map(
                        (
                          skill,
                          index
                        ) => (
                          <div
                            key={index}
                            className="rounded-2xl border border-slate-200 bg-white p-5"
                          >

                            <div className="grid gap-4 md:grid-cols-[1fr_220px_auto]">

                              <input
                                value={
                                  skill.name
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateSkill(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g. React.js"
                                className={
                                  inputClass
                                }
                              />

                              <select
                                value={
                                  skill.level
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateSkill(
                                    index,
                                    "level",
                                    e.target.value
                                  )
                                }
                                className={
                                  inputClass
                                }
                              >

                                {skillLevels.map(
                                  (
                                    level
                                  ) => (
                                    <option
                                      key={
                                        level
                                      }
                                      value={
                                        level
                                      }
                                    >
                                      {level
                                        .charAt(
                                          0
                                        )
                                        .toUpperCase() +
                                        level.slice(
                                          1
                                        )}
                                    </option>
                                  )
                                )}

                              </select>

                              <button
                                type="button"
                                onClick={() =>
                                  removeSkill(
                                    index
                                  )
                                }
                                className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                              >
                                <Trash2
                                  size={17}
                                />
                              </button>

                            </div>

                          </div>
                        )
                      )
                    )}

                  </div>

                </section>
              )}

              {/* EXPERIENCE */}

              {activeSection ===
                "experience" && (
                <section>

                  <SectionHeader
                    eyebrow="EXPERIENCE"
                    title="Your professional experience"
                    description="Add your previous and current roles."
                    action={
                      <AddButton
                        onClick={
                          addExperience
                        }
                        label="Add experience"
                      />
                    }
                  />

                  <div className="mt-8 space-y-5">

                    {formData.experience
                      .length === 0 ? (
                      <EmptySection
                        icon={
                          BriefcaseBusiness
                        }
                        title="No experience added"
                        description="Add internships, jobs, contracts or other professional experience."
                        action={
                          <AddButton
                            onClick={
                              addExperience
                            }
                            label="Add experience"
                          />
                        }
                      />
                    ) : (
                      formData.experience.map(
                        (
                          item,
                          index
                        ) => (
                          <div
                            key={index}
                            className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
                          >

                            <div className="mb-5 flex items-start justify-between">

                              <div>

                                <h3 className="text-sm font-semibold text-slate-900">
                                  Experience{" "}
                                  {index + 1}
                                </h3>

                                <p className="mt-1 text-xs text-slate-400">
                                  Add details about this role.
                                </p>

                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  removeExperience(
                                    index
                                  )
                                }
                                className="text-slate-400 hover:text-red-500"
                              >
                                <Trash2
                                  size={17}
                                />
                              </button>

                            </div>

                            <div className="grid gap-4 md:grid-cols-2">

                              <input
                                value={
                                  item.position
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateExperience(
                                    index,
                                    "position",
                                    e.target.value
                                  )
                                }
                                placeholder="Job title / Position"
                                className={
                                  inputClass
                                }
                              />

                              <input
                                value={
                                  item.company
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateExperience(
                                    index,
                                    "company",
                                    e.target.value
                                  )
                                }
                                placeholder="Company"
                                className={
                                  inputClass
                                }
                              />

                              <select
                                value={
                                  item.employmentType
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateExperience(
                                    index,
                                    "employmentType",
                                    e.target.value
                                  )
                                }
                                className={
                                  inputClass
                                }
                              >

                                {employmentTypes.map(
                                  (
                                    type
                                  ) => (
                                    <option
                                      key={
                                        type
                                      }
                                      value={
                                        type
                                      }
                                    >
                                      {type
                                        .charAt(
                                          0
                                        )
                                        .toUpperCase() +
                                        type.slice(
                                          1
                                        )}
                                    </option>
                                  )
                                )}

                              </select>

                              <input
                                type="date"
                                value={
                                  item.startDate
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateExperience(
                                    index,
                                    "startDate",
                                    e.target.value
                                  )
                                }
                                className={
                                  inputClass
                                }
                              />

                              <input
                                type="date"
                                disabled={
                                  item.currentlyWorking
                                }
                                value={
                                  item.endDate
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateExperience(
                                    index,
                                    "endDate",
                                    e.target.value
                                  )
                                }
                                className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-50`}
                              />

                            </div>

                            <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm text-slate-600">

                              <input
                                type="checkbox"
                                checked={
                                  item.currentlyWorking
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateExperience(
                                    index,
                                    "currentlyWorking",
                                    e.target.checked
                                  )
                                }
                                className="h-4 w-4 accent-violet-600"
                              />

                              I currently work here

                            </label>

                            <textarea
                              rows={5}
                              value={
                                item.description
                              }
                              onChange={(
                                e
                              ) =>
                                updateExperience(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Describe your responsibilities, achievements and impact..."
                              className={`${inputClass} mt-5 h-auto resize-none py-3.5`}
                            />

                          </div>
                        )
                      )
                    )}

                  </div>

                </section>
              )}

              {/* EDUCATION */}

              {activeSection ===
                "education" && (
                <section>

                  <SectionHeader
                    eyebrow="EDUCATION"
                    title="Your educational background"
                    description="Add your degrees, institutions and academic details."
                    action={
                      <AddButton
                        onClick={
                          addEducation
                        }
                        label="Add education"
                      />
                    }
                  />

                  <div className="mt-8 space-y-5">

                    {formData.education
                      .length === 0 ? (
                      <EmptySection
                        icon={
                          GraduationCap
                        }
                        title="No education added"
                        description="Add your academic background."
                        action={
                          <AddButton
                            onClick={
                              addEducation
                            }
                            label="Add education"
                          />
                        }
                      />
                    ) : (
                      formData.education.map(
                        (
                          item,
                          index
                        ) => (
                          <div
                            key={index}
                            className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
                          >

                            <div className="mb-5 flex items-center justify-between">

                              <h3 className="text-sm font-semibold text-slate-900">
                                Education{" "}
                                {index + 1}
                              </h3>

                              <button
                                type="button"
                                onClick={() =>
                                  removeEducation(
                                    index
                                  )
                                }
                                className="text-slate-400 hover:text-red-500"
                              >
                                <Trash2
                                  size={17}
                                />
                              </button>

                            </div>

                            <div className="grid gap-4 md:grid-cols-2">

                              <input
                                value={
                                  item.institute
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateEducation(
                                    index,
                                    "institute",
                                    e.target.value
                                  )
                                }
                                placeholder="Institution / University"
                                className={
                                  inputClass
                                }
                              />

                              <input
                                value={
                                  item.degree
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateEducation(
                                    index,
                                    "degree",
                                    e.target.value
                                  )
                                }
                                placeholder="Degree"
                                className={
                                  inputClass
                                }
                              />

                              <input
                                value={
                                  item.field
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateEducation(
                                    index,
                                    "field",
                                    e.target.value
                                  )
                                }
                                placeholder="Field of study"
                                className={
                                  inputClass
                                }
                              />

                              <input
                                value={
                                  item.grade
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateEducation(
                                    index,
                                    "grade",
                                    e.target.value
                                  )
                                }
                                placeholder="Grade / CGPA"
                                className={
                                  inputClass
                                }
                              />

                              <input
                                type="number"
                                min="1900"
                                max="2100"
                                value={
                                  item.startYear
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateEducation(
                                    index,
                                    "startYear",
                                    e.target.value
                                  )
                                }
                                placeholder="Start year"
                                className={
                                  inputClass
                                }
                              />

                              <input
                                type="number"
                                min="1900"
                                max="2100"
                                value={
                                  item.endYear
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateEducation(
                                    index,
                                    "endYear",
                                    e.target.value
                                  )
                                }
                                placeholder="End year"
                                className={
                                  inputClass
                                }
                              />

                            </div>

                          </div>
                        )
                      )
                    )}

                  </div>

                </section>
              )}

              {/* PROJECTS */}

              {activeSection ===
                "projects" && (
                <section>

                  <SectionHeader
                    eyebrow="PROJECTS"
                    title="Show what you've built"
                    description="Highlight projects that demonstrate your skills."
                    action={
                      <AddButton
                        onClick={
                          addProject
                        }
                        label="Add project"
                      />
                    }
                  />

                  <div className="mt-8 space-y-5">

                    {formData.projects
                      .length === 0 ? (
                      <EmptySection
                        icon={
                          FolderGit2
                        }
                        title="No projects added"
                        description="Add projects you're proud of."
                        action={
                          <AddButton
                            onClick={
                              addProject
                            }
                            label="Add project"
                          />
                        }
                      />
                    ) : (
                      formData.projects.map(
                        (
                          project,
                          index
                        ) => (
                          <div
                            key={index}
                            className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
                          >

                            <div className="mb-5 flex items-center justify-between">

                              <h3 className="text-sm font-semibold text-slate-900">
                                Project{" "}
                                {index + 1}
                              </h3>

                              <button
                                type="button"
                                onClick={() =>
                                  removeProject(
                                    index
                                  )
                                }
                                className="text-slate-400 hover:text-red-500"
                              >
                                <Trash2
                                  size={17}
                                />
                              </button>

                            </div>

                            <div className="space-y-4">

                              <input
                                value={
                                  project.title
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateProject(
                                    index,
                                    "title",
                                    e.target.value
                                  )
                                }
                                placeholder="Project title"
                                className={
                                  inputClass
                                }
                              />

                              <textarea
                                rows={5}
                                value={
                                  project.description
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateProject(
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                placeholder="Describe what you built, the problem it solves and your contribution..."
                                className={`${inputClass} h-auto resize-none py-3.5`}
                              />

                              <div className="grid gap-4 md:grid-cols-2">

                                <input
                                  type="url"
                                  value={
                                    project.githubUrl
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    updateProject(
                                      index,
                                      "githubUrl",
                                      e.target.value
                                    )
                                  }
                                  placeholder="GitHub URL"
                                  className={
                                    inputClass
                                  }
                                />

                                <input
                                  type="url"
                                  value={
                                    project.liveUrl
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    updateProject(
                                      index,
                                      "liveUrl",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Live project URL"
                                  className={
                                    inputClass
                                  }
                                />

                              </div>

                              <input
                                value={
                                  project.technologies.join(
                                    ", "
                                  )
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateProject(
                                    index,
                                    "technologies",
                                    e.target.value
                                      .split(",")
                                      .map(
                                        (
                                          item
                                        ) =>
                                          item.trim()
                                      )
                                      .filter(
                                        Boolean
                                      )
                                  )
                                }
                                placeholder="Technologies — React, Node.js, MongoDB"
                                className={
                                  inputClass
                                }
                              />

                              <div className="grid gap-4 md:grid-cols-2">

                                <input
                                  type="date"
                                  value={
                                    project.startDate
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    updateProject(
                                      index,
                                      "startDate",
                                      e.target.value
                                    )
                                  }
                                  className={
                                    inputClass
                                  }
                                />

                                <input
                                  type="date"
                                  value={
                                    project.endDate
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    updateProject(
                                      index,
                                      "endDate",
                                      e.target.value
                                    )
                                  }
                                  className={
                                    inputClass
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
              )}

              {/* LINKS */}

              {activeSection ===
                "links" && (
                <section>

                  <SectionHeader
                    eyebrow="SOCIAL & LINKS"
                    title="Connect your professional profiles"
                    description="Add links where recruiters can learn more about you."
                  />

                  <div className="mt-8 space-y-4">

                    <SocialInput
                      icon={FaGithub}
                      label="GitHub"
                      placeholder="https://github.com/username"
                      value={
                        formData.socialLinks
                          .github
                      }
                      onChange={(value) =>
                        updateNestedField(
                          "socialLinks",
                          "github",
                          value
                        )
                      }
                    />

                    <SocialInput
                      icon={FaLinkedin}
                      label="LinkedIn"
                      placeholder="https://linkedin.com/in/username"
                      value={
                        formData.socialLinks
                          .linkedin
                      }
                      onChange={(value) =>
                        updateNestedField(
                          "socialLinks",
                          "linkedin",
                          value
                        )
                      }
                    />

                    <SocialInput
                      icon={Globe}
                      label="Portfolio"
                      placeholder="https://yourportfolio.com"
                      value={
                        formData.socialLinks
                          .portfolio
                      }
                      onChange={(value) =>
                        updateNestedField(
                          "socialLinks",
                          "portfolio",
                          value
                        )
                      }
                    />

                  </div>

                </section>
              )}

              {/* RESUME */}

              {activeSection ===
                "resume" && (
                <section>

                  <SectionHeader
                    eyebrow="RESUME"
                    title="Your resume"
                    description="Connect your existing resume to your Peer.Hiring profile."
                  />

                  <div className="mt-8">

                    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center sm:p-10">

                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50">

                        <Upload
                          size={23}
                          className="text-violet-600"
                        />

                      </div>

                      <h3 className="mt-5 text-sm font-semibold text-slate-900">
                        {formData.resumeId
                          ? "Resume connected"
                          : "No resume connected"}
                      </h3>

                      <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500">
                        {formData.resumeId
                          ? "Your existing resume is connected to this profile."
                          : "Connect a resume from your Resume section."}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            "/resume"
                          )
                        }
                        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                      >
                        <FileText
                          size={15}
                        />

                        Manage resume
                      </button>

                    </div>

                  </div>

                </section>
              )}

              {/* PREFERENCES */}

              {activeSection ===
                "preferences" && (
                <section>

                  <SectionHeader
                    eyebrow="CAREER PREFERENCES"
                    title="Tell recruiters what you're looking for"
                    description="These preferences help match your profile with relevant opportunities."
                  />

                  <div className="mt-8 space-y-6">

                    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">

                      <div>

                        <p className="text-sm font-semibold text-slate-900">
                          Currently looking for opportunities
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Let recruiters know that you're open to relevant opportunities.
                        </p>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          updateNestedField(
                            "preferences",
                            "lookingForJob",
                            !formData
                              .preferences
                              .lookingForJob
                          )
                        }
                        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                          formData
                            .preferences
                            .lookingForJob
                            ? "bg-violet-600"
                            : "bg-slate-300"
                        }`}
                      >

                        <span
                          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                            formData
                              .preferences
                              .lookingForJob
                              ? "left-6"
                              : "left-1"
                          }`}
                        />

                      </button>

                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">

                      <h3 className="text-sm font-semibold text-slate-900">
                        Preferred job type
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Select all that apply.
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">

                        {jobTypes.map(
                          (type) => {
                            const selected =
                              formData
                                .preferences
                                .preferredJobType
                                .includes(
                                  type
                                );

                            return (
                              <button
                                key={type}
                                type="button"
                                onClick={() =>
                                  toggleJobType(
                                    type
                                  )
                                }
                                className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition ${
                                  selected
                                    ? "border-violet-200 bg-violet-50 text-violet-700"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                }`}
                              >

                                {selected && (
                                  <Check
                                    size={13}
                                    className="mr-1.5 inline"
                                  />
                                )}

                                {type}

                              </button>
                            );
                          }
                        )}

                      </div>

                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">

                      <h3 className="text-sm font-semibold text-slate-900">
                        Expected salary
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Add an expected salary range if you want recruiters to see it.
                      </p>

                      <div className="mt-4 grid gap-4 md:grid-cols-3">

                        <select
                          value={
                            formData
                              .preferences
                              .expectedSalary
                              .currency
                          }
                          onChange={(e) =>
                            updateNestedField(
                              "preferences",
                              "expectedSalary",
                              {
                                ...formData
                                  .preferences
                                  .expectedSalary,

                                currency:
                                  e.target
                                    .value,
                              }
                            )
                          }
                          className={
                            inputClass
                          }
                        >

                          <option value="INR">
                            INR — ₹
                          </option>

                          <option value="USD">
                            USD — $
                          </option>

                          <option value="EUR">
                            EUR — €
                          </option>

                        </select>

                        <input
                          type="number"
                          min="0"
                          value={
                            formData
                              .preferences
                              .expectedSalary
                              .min
                          }
                          onChange={(e) =>
                            updateNestedField(
                              "preferences",
                              "expectedSalary",
                              {
                                ...formData
                                  .preferences
                                  .expectedSalary,

                                min:
                                  e.target
                                    .value,
                              }
                            )
                          }
                          placeholder="Minimum"
                          className={
                            inputClass
                          }
                        />

                        <input
                          type="number"
                          min="0"
                          value={
                            formData
                              .preferences
                              .expectedSalary
                              .max
                          }
                          onChange={(e) =>
                            updateNestedField(
                              "preferences",
                              "expectedSalary",
                              {
                                ...formData
                                  .preferences
                                  .expectedSalary,

                                max:
                                  e.target
                                    .value,
                              }
                            )
                          }
                          placeholder="Maximum"
                          className={
                            inputClass
                          }
                        />

                      </div>

                    </div>

                  </div>

                </section>
              )}

            </div>

            {/* FOOTER */}

            <div className="sticky bottom-0 border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-6 lg:px-10">

              <div className="mx-auto flex max-w-[950px] items-center justify-between gap-4">

                <p className="hidden text-xs text-slate-400 sm:block">
                  Your information can be updated later.
                </p>

                <div className="ml-auto flex items-center gap-2 sm:gap-3">

                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={saving}
                    className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      saving ||
                      !formData.headline.trim()
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-violet-200 hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5"
                  >

                    {saving ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                        Saving...
                      </>
                    ) : (
                      profile
                        ? "Save changes"
                        : "Create profile"
                    )}

                  </button>

                </div>

              </div>

            </div>

          </form>

        </main>

      </div>

    </div>
  );
}

/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-50 disabled:cursor-not-allowed disabled:bg-slate-50";

function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div className="flex items-start justify-between gap-6">

      <div className="min-w-0">

        <p className="text-[11px] font-semibold tracking-[0.12em] text-violet-600">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.025em] text-slate-900 sm:text-[25px]">
          {title}
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          {description}
        </p>

      </div>

      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}

    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}) {
  return (
    <div>

      <div className="mb-2">

        <label className="text-sm font-semibold text-slate-800">
          {label}

          {required && (
            <span className="ml-1 text-violet-600">
              *
            </span>
          )}
        </label>

        {hint && (
          <p className="mt-1 text-xs text-slate-400">
            {hint}
          </p>
        )}

      </div>

      {children}

    </div>
  );
}

function AddButton({
  onClick,
  label,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3.5 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-100"
    >
      <Plus size={14} />
      {label}
    </button>
  );
}

function EmptySection({
  icon: Icon,
  title,
  description,
  action,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center">

      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50">

        <Icon
          size={21}
          className="text-violet-600"
        />

      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-800">
        {title}
      </h3>

      <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-slate-500">
        {description}
      </p>

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}

    </div>
  );
}

function SocialInput({
  icon: Icon,
  label,
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50">

          <Icon
            size={18}
            className="text-slate-600"
          />

        </div>

        <div className="min-w-0 flex-1">

          <p className="mb-2 text-xs font-semibold text-slate-700">
            {label}
          </p>

          <input
            type="url"
            value={value}
            onChange={(e) =>
              onChange(
                e.target.value
              )
            }
            placeholder={
              placeholder
            }
            className={inputClass}
          />

        </div>

      </div>

    </div>
  );
}

export default CreateProfile1;